import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PartnerProvider } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';
import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav';
import PartnerSplashScreen from '@/components/PartnerSplashScreen';
import LoginScreen from '@/components/LoginScreen';
import CallCustomerModal from '@/components/modals/CallCustomerModal';
import RegisterWorkerModal from '@/components/modals/RegisterWorkerModal';
import WorkerOnboardingModal from '@/components/modals/WorkerOnboardingModal';

SplashScreen.preventAutoHideAsync().catch(() => {});

function MainAppShell() {
  const { user, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Palette.secondary} />
      </View>
    );
  }

  // If user is not logged in, render the Login / Sign Up portal
  if (!user) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={Palette.surface} />
        <LoginScreen />
      </>
    );
  }

  // Once authenticated, render main worker app + one-time onboarding modal if needed
  return (
    <>
      <StatusBar
        barStyle={showSplash ? 'light-content' : 'dark-content'}
        backgroundColor={showSplash ? Palette.primary : Palette.surface}
      />
      <AppHeader />
      <View style={styles.contentArea}>
        <Slot />
      </View>
      <BottomNav />

      {/* Global Modals */}
      <CallCustomerModal />
      <RegisterWorkerModal />

      {/* One-Time Onboarding Modal for Supabase Database */}
      <WorkerOnboardingModal />

      {/* 3-Second First-Time Partner Splash Screen */}
      {showSplash && (
        <PartnerSplashScreen onFinish={() => setShowSplash(false)} />
      )}
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PartnerProvider>
          <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right', 'bottom']}>
            <MainAppShell />
          </SafeAreaView>
        </PartnerProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Palette.surface,
  },
  contentArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.background,
  },
});
