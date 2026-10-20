import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, WorkerProfileData } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  workerProfile: WorkerProfileData | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  saveWorkerProfile: (data: Omit<WorkerProfileData, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ONBOARDING_PREFIX = '@localfix_worker_onboarded_';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check initial session & listen to auth changes
  useEffect(() => {
    let mounted = true;

    // Fetch existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadWorkerProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await loadWorkerProfile(currentSession.user.id);
        } else {
          setWorkerProfile(null);
          setHasCompletedOnboarding(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Listen to Supabase Realtime changes for worker_profiles
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`realtime:worker_profile:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'worker_profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const updated = payload.new as WorkerProfileData;
            setWorkerProfile(updated);
            if (updated.worker_name) {
              setHasCompletedOnboarding(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const loadWorkerProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      // 1. Check local AsyncStorage first
      const localCompleted = await AsyncStorage.getItem(`${ONBOARDING_PREFIX}${userId}`);
      let localData: WorkerProfileData | null = null;
      if (localCompleted) {
        try {
          localData = JSON.parse(localCompleted);
        } catch {
          // ignore
        }
      }

      // 2. Fetch from Supabase worker_profiles table
      const { data, error } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data && data.worker_name) {
        setWorkerProfile(data as WorkerProfileData);
        setHasCompletedOnboarding(true);
        await AsyncStorage.setItem(`${ONBOARDING_PREFIX}${userId}`, JSON.stringify(data));
      } else if (localData && localData.worker_name) {
        setWorkerProfile(localData);
        setHasCompletedOnboarding(true);
      } else {
        // Not completed onboarding yet
        setWorkerProfile(null);
        setHasCompletedOnboarding(false);
      }
    } catch {
      // Fallback to local storage on network issues
      const localCompleted = await AsyncStorage.getItem(`${ONBOARDING_PREFIX}${userId}`);
      if (localCompleted) {
        setHasCompletedOnboarding(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadWorkerProfile(user.id);
    }
  };

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    const res = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });
    setIsLoading(false);
    return { error: res.error };
  };

  const signUp = async (email: string, pass: string) => {
    setIsLoading(true);
    const res = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
    });
    setIsLoading(false);
    return { error: res.error };
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setWorkerProfile(null);
    setHasCompletedOnboarding(false);
    setIsLoading(false);
  };

  const saveWorkerProfile = async (
    data: Omit<WorkerProfileData, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const payload: WorkerProfileData = {
      id: user.id,
      worker_name: data.worker_name.trim(),
      experience_years: Number(data.experience_years) || 1,
      verification_status: data.verification_status || 'verified',
      availability_status: data.availability_status || 'available',
      hourly_rate: Number(data.hourly_rate) || 250,
      daily_rate: Number(data.daily_rate) || 800,
      rates_negotiable: Boolean(data.rates_negotiable),
      district_id: data.district_id || null,
      updated_at: new Date().toISOString(),
    };

    // Store in local storage immediately for seamless offline/instant responsiveness
    await AsyncStorage.setItem(`${ONBOARDING_PREFIX}${user.id}`, JSON.stringify(payload));
    setWorkerProfile(payload);
    setHasCompletedOnboarding(true);

    try {
      // 1. Try Upsert into worker_profiles
      const { error: upsertError } = await supabase
        .from('worker_profiles')
        .upsert(payload, { onConflict: 'id' });

      if (upsertError) {
        console.warn('Supabase upsert warning, attempting update/insert fallback:', upsertError.message);
        // Try update if row already existed
        const { error: updateError } = await supabase
          .from('worker_profiles')
          .update(payload)
          .eq('id', user.id);

        if (updateError) {
          console.warn('Supabase update warning:', updateError.message);
        }
      }

      // Also ensure profiles table has user's full_name
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: data.worker_name.trim(),
            updated_at: new Date().toISOString(),
          });
      } catch {
        // Optional profile mirror
      }

      return { success: true };
    } catch (err: any) {
      console.warn('saveWorkerProfile network sync catch:', err);
      // Still succeed locally so user is not blocked
      return { success: true };
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      workerProfile,
      isLoading,
      hasCompletedOnboarding,
      signIn,
      signUp,
      signOut,
      saveWorkerProfile,
      refreshProfile,
    }),
    [user, session, workerProfile, isLoading, hasCompletedOnboarding]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
