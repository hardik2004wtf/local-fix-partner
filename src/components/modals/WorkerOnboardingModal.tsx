import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { usePartner } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';
import { WorkerProfileData } from '@/lib/supabase';

const EXP_PRESETS = [1, 2, 3, 5, 8, 10];

export default function WorkerOnboardingModal() {
  const { user, hasCompletedOnboarding, saveWorkerProfile, workerProfile } = useAuth();
  const { updateProfile } = usePartner();

  const [workerName, setWorkerName] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [verificationStatus, setVerificationStatus] = useState<WorkerProfileData['verification_status']>('verified');
  const [availabilityStatus, setAvailabilityStatus] = useState<WorkerProfileData['availability_status']>('available');
  const [hourlyRate, setHourlyRate] = useState('250');
  const [dailyRate, setDailyRate] = useState('800');
  const [ratesNegotiable, setRatesNegotiable] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Initialize defaults
  useEffect(() => {
    if (user && !workerName) {
      const emailPrefix = user.email?.split('@')[0] || '';
      const formatted = emailPrefix
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setWorkerName(workerProfile?.worker_name || formatted || 'Rahul Kumar');
    }
  }, [user, workerProfile]);

  // If already completed or not logged in, don't show modal
  if (!user || hasCompletedOnboarding) {
    return null;
  }

  const handleSave = async () => {
    if (!workerName.trim()) {
      Alert.alert('Required Field', 'Please enter your full worker name.');
      return;
    }

    const expNum = parseFloat(experienceYears);
    if (isNaN(expNum) || expNum < 0) {
      Alert.alert('Invalid Experience', 'Please enter a valid number of years of experience.');
      return;
    }

    const hourlyNum = parseFloat(hourlyRate);
    const dailyNum = parseFloat(dailyRate);
    if (isNaN(hourlyNum) || hourlyNum <= 0) {
      Alert.alert('Invalid Rate', 'Please enter a valid hourly rate (e.g. ₹250).');
      return;
    }

    setSubmitting(true);
    const res = await saveWorkerProfile({
      worker_name: workerName.trim(),
      experience_years: expNum,
      verification_status: verificationStatus,
      availability_status: availabilityStatus,
      hourly_rate: hourlyNum,
      daily_rate: dailyNum > 0 ? dailyNum : hourlyNum * 4,
      rates_negotiable: ratesNegotiable,
    });

    // Also update PartnerContext in memory
    updateProfile({
      name: workerName.trim(),
      isOnline: availabilityStatus === 'available',
      kyc: {
        aadhaarVerified: verificationStatus === 'verified',
        policeCleared: true,
        skillCertified: true,
        bankLinked: true,
      },
    });

    setSubmitting(false);

    if (res.success) {
      Alert.alert(
        'Profile Activated!',
        `Welcome ${workerName}! Your professional rates and availability are now synced in realtime.`
      );
    }
  };

  return (
    <Modal visible={!hasCompletedOnboarding} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Ionicons name="sparkles" size={12} color={Palette.secondary} />
                <Text style={styles.badgeText}>ONE-TIME PROFILE SETUP</Text>
              </View>
            </View>
            <Text style={styles.modalTitle}>Worker Professional Profile</Text>
            <Text style={styles.modalSub}>
              Please configure your trade profile once. This data is published in realtime to residents looking for local technicians.
            </Text>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Live Preview Mini Card */}
            <View style={styles.previewBox}>
              <View style={styles.previewTopRow}>
                <View style={styles.previewAvatar}>
                  <Text style={styles.previewAvatarText}>
                    {workerName.slice(0, 2).toUpperCase() || 'WK'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewName}>{workerName || 'Your Name'}</Text>
                  <Text style={styles.previewExp}>
                    {experienceYears || '0'} Years Experience •{' '}
                    <Text
                      style={{
                        color:
                          availabilityStatus === 'available'
                            ? Palette.successText
                            : Palette.warningText,
                        fontWeight: '700',
                      }}>
                      {availabilityStatus === 'available'
                        ? '🟢 Available'
                        : availabilityStatus === 'busy'
                        ? '🟡 Busy'
                        : '⚪ Offline'}
                    </Text>
                  </Text>
                </View>
                <View style={styles.previewRateBadge}>
                  <Text style={styles.previewRateText}>₹{hourlyRate || '0'}/hr</Text>
                </View>
              </View>
            </View>

            {/* 1. Worker Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Worker Full Name <Text style={styles.reqStar}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={18} color={Palette.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Rahul Kumar"
                  placeholderTextColor={Palette.textSecondary}
                  value={workerName}
                  onChangeText={setWorkerName}
                />
              </View>
            </View>

            {/* 2. Experience in Years */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Experience (Years) <Text style={styles.reqStar}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="time-outline" size={18} color={Palette.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="5"
                  placeholderTextColor={Palette.textSecondary}
                  value={experienceYears}
                  onChangeText={setExperienceYears}
                  keyboardType="numeric"
                />
              </View>
              {/* Presets Chips */}
              <View style={styles.chipsRow}>
                {EXP_PRESETS.map((yr) => (
                  <Pressable
                    key={yr}
                    onPress={() => setExperienceYears(yr.toString())}
                    style={[
                      styles.chip,
                      experienceYears === yr.toString() && styles.chipActive,
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        experienceYears === yr.toString() && styles.chipTextActive,
                      ]}>
                      {yr} {yr === 1 ? 'Year' : 'Years'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* 3. Verification Status */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Verification Status</Text>
              <View style={styles.optionsRow}>
                <Pressable
                  onPress={() => setVerificationStatus('verified')}
                  style={[
                    styles.optionBtn,
                    verificationStatus === 'verified' && styles.optionBtnActive,
                  ]}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={
                      verificationStatus === 'verified'
                        ? Palette.successText
                        : Palette.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.optionBtnText,
                      verificationStatus === 'verified' && styles.optionBtnTextActive,
                    ]}>
                    Verified
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setVerificationStatus('pending')}
                  style={[
                    styles.optionBtn,
                    verificationStatus === 'pending' && styles.optionBtnActive,
                  ]}>
                  <Ionicons
                    name="hourglass-outline"
                    size={16}
                    color={
                      verificationStatus === 'pending'
                        ? Palette.warningText
                        : Palette.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.optionBtnText,
                      verificationStatus === 'pending' && styles.optionBtnTextActive,
                    ]}>
                    Pending
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setVerificationStatus('unverified')}
                  style={[
                    styles.optionBtn,
                    verificationStatus === 'unverified' && styles.optionBtnActive,
                  ]}>
                  <Ionicons
                    name="ellipse-outline"
                    size={16}
                    color={
                      verificationStatus === 'unverified'
                        ? Palette.primary
                        : Palette.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.optionBtnText,
                      verificationStatus === 'unverified' && styles.optionBtnTextActive,
                    ]}>
                    Standard
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* 4. Availability Status */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Realtime Availability Status</Text>
              <View style={styles.optionsRow}>
                <Pressable
                  onPress={() => setAvailabilityStatus('available')}
                  style={[
                    styles.optionBtn,
                    availabilityStatus === 'available' && styles.optionBtnActive,
                  ]}>
                  <View style={[styles.statusDot, { backgroundColor: Palette.success }]} />
                  <Text
                    style={[
                      styles.optionBtnText,
                      availabilityStatus === 'available' && styles.optionBtnTextActive,
                    ]}>
                    Available
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setAvailabilityStatus('busy')}
                  style={[
                    styles.optionBtn,
                    availabilityStatus === 'busy' && styles.optionBtnActive,
                  ]}>
                  <View style={[styles.statusDot, { backgroundColor: Palette.secondary }]} />
                  <Text
                    style={[
                      styles.optionBtnText,
                      availabilityStatus === 'busy' && styles.optionBtnTextActive,
                    ]}>
                    On Job
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setAvailabilityStatus('offline')}
                  style={[
                    styles.optionBtn,
                    availabilityStatus === 'offline' && styles.optionBtnActive,
                  ]}>
                  <View style={[styles.statusDot, { backgroundColor: Palette.textSecondary }]} />
                  <Text
                    style={[
                      styles.optionBtnText,
                      availabilityStatus === 'offline' && styles.optionBtnTextActive,
                    ]}>
                    Offline
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* 5 & 6. Hourly Rate and Daily Rate */}
            <View style={styles.ratesRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>
                  Hourly Rate (₹) <Text style={styles.reqStar}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="250"
                    placeholderTextColor={Palette.textSecondary}
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                    keyboardType="numeric"
                  />
                  <Text style={styles.perText}>/hr</Text>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Daily Rate (₹)</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="800"
                    placeholderTextColor={Palette.textSecondary}
                    value={dailyRate}
                    onChangeText={setDailyRate}
                    keyboardType="numeric"
                  />
                  <Text style={styles.perText}>/day</Text>
                </View>
              </View>
            </View>

            {/* 7. Rates Negotiable Switch */}
            <View style={styles.switchBox}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.switchTitle}>Rates Negotiable</Text>
                <Text style={styles.switchSub}>
                  Allow quotes to be flexible based on diagnostic complexity and materials provided.
                </Text>
              </View>
              <Switch
                value={ratesNegotiable}
                onValueChange={setRatesNegotiable}
                trackColor={{ false: Palette.borderDark, true: Palette.secondary }}
                thumbColor={Palette.surface}
              />
            </View>

            {/* Notice */}
            <View style={styles.noticeBox}>
              <Ionicons name="information-circle-outline" size={16} color={Palette.info} />
              <Text style={styles.noticeText}>
                This one-time step binds your device to the local municipal worker pool. You can update rates anytime from your Profile.
              </Text>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <Pressable
            onPress={handleSave}
            disabled={submitting}
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && { opacity: 0.9 },
              submitting && { opacity: 0.7 },
            ]}>
            {submitting ? (
              <ActivityIndicator color={Palette.primary} />
            ) : (
              <>
                <MaterialCommunityIcons name="check-decagram" size={20} color={Palette.primary} />
                <Text style={styles.submitBtnText}>Activate Worker Workspace</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 27, 51, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.warningText,
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.primary,
  },
  modalSub: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 16,
    marginTop: 4,
  },
  scrollView: {
    marginBottom: 16,
  },
  previewBox: {
    backgroundColor: Palette.infoBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.infoBorder,
    marginBottom: 16,
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewName: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
  },
  previewExp: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  previewRateBadge: {
    backgroundColor: Palette.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  previewRateText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.primary,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 6,
  },
  reqStar: {
    color: Palette.danger,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.primary,
    height: '100%',
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primary,
  },
  perText: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  chipActive: {
    backgroundColor: Palette.warningBg,
    borderColor: Palette.secondary,
  },
  chipText: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Palette.warningText,
    fontWeight: '700',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: 10,
    borderRadius: 10,
  },
  optionBtnActive: {
    borderColor: Palette.secondary,
    backgroundColor: Palette.warningBg,
  },
  optionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  optionBtnTextActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ratesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  switchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  switchSub: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Palette.infoBg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: Palette.info,
    lineHeight: 15,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Palette.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.primary,
  },
});
