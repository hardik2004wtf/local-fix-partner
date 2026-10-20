import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/theme';

interface PartnerSplashScreenProps {
  onFinish?: () => void;
}

export default function PartnerSplashScreen({ onFinish }: PartnerSplashScreenProps) {
  const [statusText, setStatusText] = useState('Initializing Municipal Network...');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2800,
        useNativeDriver: false,
      }),
    ]).start();

    // Pulse animation for the logo glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Timed status updates over the 3-second duration
    const t1 = setTimeout(() => {
      setStatusText('Verifying Partner Credentials (Ward 12)...');
    }, 1100);

    const t2 = setTimeout(() => {
      setStatusText('Syncing Live Dispatches & Muzaffarpur Hub...');
    }, 2100);

    // Dismiss splash screen after 3 seconds with smooth fade
    const t3 = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background Decorative Circles */}
      <View style={styles.topBackdropCircle} />
      <View style={styles.bottomBackdropCircle} />

      <Animated.View style={[styles.contentBox, { transform: [{ scale: scaleAnim }] }]}>
        {/* Animated Brand Shield Logo */}
        <View style={styles.logoOuterWrapper}>
          <Animated.View style={[styles.logoGlowRing, { opacity: glowAnim }]} />
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="tools" size={38} color={Palette.secondary} />
            <View style={styles.verifiedMiniDot}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Brand Title */}
        <View style={styles.titleSection}>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandName}>LocalFix</Text>
            <View style={styles.partnerBadge}>
              <Text style={styles.partnerBadgeText}>PARTNER</Text>
            </View>
          </View>
          <Text style={styles.brandSubtitle}>
            MUNICIPAL DISPATCH NETWORK • MUZAFFARPUR
          </Text>
        </View>

        {/* Loading / Progress Indicator (3 seconds) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          <View style={styles.statusRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusLabel}>{statusText}</Text>
          </View>
        </View>

        {/* Feature Highlights Pills */}
        <View style={styles.pillsRow}>
          <View style={styles.featurePill}>
            <Ionicons name="shield-checkmark" size={12} color={Palette.secondary} />
            <Text style={styles.featurePillText}>0% Labour Cut</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="flash" size={12} color={Palette.secondary} />
            <Text style={styles.featurePillText}>Instant IMPS Payout</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="lock-closed" size={12} color={Palette.secondary} />
            <Text style={styles.featurePillText}>District Lock</Text>
          </View>
        </View>
      </Animated.View>

      {/* Footer Credentials */}
      <View style={styles.footerSection}>
        <Text style={styles.footerCryptText}>
          SECURE PROTOCOL • ENCRYPTED BIOMETRIC WORKER SESSION
        </Text>
        <Text style={styles.versionText}>v2.4.0 • Enterprise Partner Edition</Text>
      </View>
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Palette.primary, // #0C1B33 Deep Navy
    zIndex: 99999,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
  },
  topBackdropCircle: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(243, 158, 37, 0.08)', // #F39E25 subtle glow
  },
  bottomBackdropCircle: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  logoOuterWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoGlowRing: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: Palette.secondary, // #F39E25
    backgroundColor: 'rgba(243, 158, 37, 0.15)',
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#142542',
    borderWidth: 2,
    borderColor: 'rgba(243, 158, 37, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  verifiedMiniDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Palette.primary,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  partnerBadge: {
    backgroundColor: Palette.secondary, // #F39E25
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  partnerBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: Palette.primary,
    letterSpacing: 0.8,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginTop: 6,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 28,
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Palette.secondary, // #F39E25
    borderRadius: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.secondary,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featurePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  footerSection: {
    alignItems: 'center',
    gap: 4,
  },
  footerCryptText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  versionText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
});
