import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tdzktjxordagqsktzqnu.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkemt0anhvcmRhZ3Fza3R6cW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzMzODMsImV4cCI6MjEwNzcwOTM4M30.WZURU19110aIXxDeXb_YZa8BmuojQuL02Q_RHo4Acy4';

export interface WorkerProfileData {
  id?: string;
  worker_name: string;
  experience_years: number;
  verification_status: 'verified' | 'pending' | 'unverified';
  availability_status: 'available' | 'busy' | 'offline';
  hourly_rate: number;
  daily_rate: number;
  rates_negotiable: boolean;
  district_id?: string | null;
  average_rating?: number;
  completed_jobs_count?: number;
  created_at?: string;
  updated_at?: string;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
