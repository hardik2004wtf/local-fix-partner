import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Palette } from '@/constants/theme';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        setErrorMessage(error.message);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error.message);
      }
    }

    setLoading(false);
  };

  const handleDemoSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    setEmail('partner_test_check@localfix.in');
    setPassword('TestPassword123!');
    const { error } = await signIn('partner_test_check@localfix.in', 'TestPassword123!');
    if (error) {
      // If doesn't exist yet, sign up
      const res = await signUp('partner_test_check@localfix.in', 'TestPassword123!');
      if (res.error) {
        setErrorMessage(res.error.message);
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Top Header Card */}
        <View style={styles.headerBox}>
          <View style={styles.brandIconWrapper}>
            <MaterialCommunityIcons name="toolbox" size={28} color={Palette.surface} />
          </View>
          <View style={styles.portalBadge}>
            <View style={styles.portalDot} />
            <Text style={styles.portalBadgeText}>MUNICIPAL PARTNER PORTAL</Text>
          </View>
          <Text style={styles.appTitle}>LocalFix Partner</Text>
          <Text style={styles.appSubtitle}>
            Direct dispatch, zero commission cuts, and verified local municipal handshake.
          </Text>
        </View>

        {/* Auth Form Card */}
        <View style={styles.card}>
          {/* Segmented Switcher */}
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => {
                setIsSignUp(false);
                setErrorMessage(null);
              }}
              style={[styles.tabButton, !isSignUp && styles.tabButtonActive]}>
              <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
                Worker Sign In
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsSignUp(true);
                setErrorMessage(null);
              }}
              style={[styles.tabButton, isSignUp && styles.tabButtonActive]}>
              <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
                Create Account
              </Text>
            </Pressable>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={Palette.dangerText} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Registered Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={Palette.textSecondary} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. technician@localfix.in"
                placeholderTextColor={Palette.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Security Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Palette.textSecondary} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={Palette.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={10}
                style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Palette.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Confirm Password (if Sign Up) */}
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="checkmark-done-outline" size={18} color={Palette.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Repeat password"
                  placeholderTextColor={Palette.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {/* Submit Action Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && { opacity: 0.9 },
              loading && styles.submitButtonDisabled,
            ]}>
            {loading ? (
              <ActivityIndicator color={Palette.primary} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {isSignUp ? 'Register As New Partner' : 'Sign In To Workspace'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={Palette.primary} />
              </>
            )}
          </Pressable>

          {/* Quick Demo Partner Sign In */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR QUICK ACCESS</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={handleDemoSignIn}
            disabled={loading}
            style={({ pressed }) => [styles.demoButton, pressed && { opacity: 0.85 }]}>
            <Ionicons name="flash-outline" size={16} color={Palette.secondary} />
            <Text style={styles.demoButtonText}>Quick One-Tap Partner Sign In</Text>
          </Pressable>
        </View>

        {/* Security & District Notice */}
        <View style={styles.securityFooter}>
          <Ionicons name="shield-checkmark-outline" size={16} color={Palette.textSecondary} />
          <Text style={styles.securityText}>
            Secured via Supabase Realtime • Municipal Encrypted Session
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 36,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  portalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.infoBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  portalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.secondary,
  },
  portalBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.info,
    letterSpacing: 0.5,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: Palette.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Palette.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: Palette.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  tabTextActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.dangerBg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    color: Palette.dangerText,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.primary,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: Palette.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.border,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textSecondary,
    paddingHorizontal: 10,
    letterSpacing: 0.5,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.warningBg,
    borderWidth: 1,
    borderColor: Palette.warningBorder,
    paddingVertical: 12,
    borderRadius: 12,
  },
  demoButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.warningText,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  securityText: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
});
