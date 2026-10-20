import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePartner } from '@/context/PartnerContext';
import { useAuth } from '@/context/AuthContext';
import { Palette } from '@/constants/theme';

export default function ProfileScreen() {
  const { partner, toggleOnline, toggleSos, setIsRegisterModalOpen } = usePartner();
  const { user, workerProfile, signOut } = useAuth();

  const handleDownloadIdCard = () => {
    Alert.alert(
      'Partner ID Card',
      `Downloading digitally signed partner credentials for ${workerProfile?.worker_name || partner.name}...\nID: ${partner.cryptographicId}`
    );
  };

  const handleCallSupport = () => {
    Alert.alert(
      'Muzaffarpur Partner Desk',
      'Connecting to 1800-LOCALFIX (24x7 Priority Trade Helpline)...'
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your LocalFix Partner account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* PROFILE HEADER CARD */}
      <View style={styles.profileCard}>
        <View style={styles.profileTopRow}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: partner.avatarUrl }}
              style={styles.profilePhoto}
            />
            <View style={styles.photoVerifiedCheck}>
              <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.profileNameRow}>
              <Text style={styles.profileName}>{workerProfile?.worker_name || partner.name}</Text>
              <View style={styles.activePill}>
                <View style={styles.activeDot} />
                <Text style={styles.activePillText}>
                  {workerProfile?.availability_status === 'available' ? 'Active' : workerProfile?.availability_status || 'Active'}
                </Text>
              </View>
            </View>

            <Text style={styles.verifiedPartnerText}>
              {workerProfile?.verification_status === 'verified' ? 'Verified Master Partner' : 'Partner'} · {partner.city}
            </Text>

            <View style={styles.ratingStatsRow}>
              <Ionicons name="star" size={13} color={Palette.secondary} />
              <Text style={styles.ratingNumber}>{partner.rating}</Text>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.jobsCountText}>{partner.totalJobs} Jobs</Text>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.onTimeText}>{partner.onTimeRate}% On-Time</Text>
            </View>
          </View>
        </View>

        {/* Accepting Jobs Toggle Row */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <View style={styles.greenToggleDot} />
            <View>
              <Text style={styles.toggleTitle}>Accepting Jobs</Text>
              <Text style={styles.toggleSub}>Muzaffarpur Central Hub</Text>
            </View>
          </View>
          <Switch
            value={partner.isOnline}
            onValueChange={toggleOnline}
            trackColor={{ false: Palette.borderDark, true: Palette.success }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* DISTRICT GEOFENCE CARD */}
      <View style={styles.geofenceCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.headerLeftSimple}>
            <Ionicons name="navigate" size={16} color={Palette.secondary} />
            <Text style={styles.cardHeaderTitle}>District Geofence</Text>
          </View>
          <View style={styles.municipalLockBadge}>
            <Ionicons name="lock-closed" size={11} color={Palette.info} />
            <Text style={styles.municipalLockText}>Municipal Lock</Text>
          </View>
        </View>

        {/* Visual Map Illustration Box */}
        <View style={styles.mapIllustrationBox}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=700&q=80',
            }}
            style={styles.mapBackdropImg}
          />
          <View style={styles.mapOverlayGradient}>
            <View style={styles.mapPinRow}>
              <Ionicons name="location" size={15} color={Palette.secondary} />
              <Text style={styles.mapCityText}>{partner.city}, Bihar</Text>
            </View>
            <View style={styles.radiusBadge}>
              <Text style={styles.radiusBadgeText}>5 km radius</Text>
            </View>
          </View>
        </View>

        {/* Assigned Wards Row */}
        <View style={styles.assignedWardsRow}>
          <Text style={styles.assignedWardsText}>
            Assigned Wards: <Text style={styles.boldWardText}>12, 14 & Central</Text>
          </Text>
          <Text style={styles.nonTransferableText}>Non-Transferable</Text>
        </View>
      </View>

      {/* KYC & CREDENTIALS CARD */}
      <View style={styles.kycCard}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardHeaderTitle}>KYC & Credentials</Text>
            <Text style={styles.kycSubText}>4 of 4 Verified</Text>
          </View>
          <View style={styles.certifiedBadge}>
            <Text style={styles.certifiedBadgeText}>100% Certified</Text>
          </View>
        </View>

        {/* KYC Item 1: Aadhaar */}
        <View style={styles.kycItemRow}>
          <View style={styles.kycIconBox}>
            <Ionicons name="id-card-outline" size={18} color={Palette.textSecondary} />
          </View>
          <View style={styles.kycItemTexts}>
            <Text style={styles.kycItemTitle}>Aadhaar KYC</Text>
            <Text style={styles.kycItemSub}>UIDAI Biometric Verified</Text>
          </View>
          <View style={styles.statusVerifiedTag}>
            <Text style={styles.statusVerifiedText}>Verified</Text>
          </View>
        </View>

        {/* KYC Item 2: Police Background Check */}
        <View style={styles.kycItemRow}>
          <View style={styles.kycIconBox}>
            <Ionicons name="shield-outline" size={18} color={Palette.textSecondary} />
          </View>
          <View style={styles.kycItemTexts}>
            <Text style={styles.kycItemTitle}>Police Background Check</Text>
            <Text style={styles.kycItemSub}>Cleared Jan 2025</Text>
          </View>
          <View style={styles.statusVerifiedTag}>
            <Text style={styles.statusVerifiedText}>Verified</Text>
          </View>
        </View>

        {/* KYC Item 3: Trade Skill Certification */}
        <View style={styles.kycItemRow}>
          <View style={styles.kycIconBox}>
            <MaterialCommunityIcons name="tools" size={18} color={Palette.textSecondary} />
          </View>
          <View style={styles.kycItemTexts}>
            <Text style={styles.kycItemTitle}>Trade Skill Certification</Text>
            <Text style={styles.kycItemSub}>NSDC Level 4 Plumber</Text>
          </View>
          <View style={styles.statusVerifiedTag}>
            <Text style={styles.statusVerifiedText}>Verified</Text>
          </View>
        </View>

        {/* KYC Item 4: Bank Account & PAN */}
        <View style={[styles.kycItemRow, { borderBottomWidth: 0 }]}>
          <View style={styles.kycIconBox}>
            <MaterialCommunityIcons name="bank" size={18} color={Palette.textSecondary} />
          </View>
          <View style={styles.kycItemTexts}>
            <Text style={styles.kycItemTitle}>Bank Account & PAN</Text>
            <Text style={styles.kycItemSub}>Instant UPI Payouts</Text>
          </View>
          <View style={styles.statusVerifiedTag}>
            <Text style={styles.statusVerifiedText}>Verified</Text>
          </View>
        </View>
      </View>

      {/* SERVICE PREFERENCES CARD */}
      <View style={styles.preferencesCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderTitle}>Service Preferences</Text>
          <Pressable onPress={() => setIsRegisterModalOpen(true)}>
            <Text style={styles.editSkillsLink}>Edit Skills</Text>
          </Pressable>
        </View>

        {/* Skills Pills */}
        <View style={styles.skillsPillsRow}>
          <View style={styles.skillPillItem}>
            <Text style={styles.skillPillText}>Plumbing</Text>
          </View>
          <View style={styles.skillPillItem}>
            <Text style={styles.skillPillText}>Pipe Fitting</Text>
          </View>
          <View style={styles.skillPillItem}>
            <Text style={styles.skillPillText}>Overhead Tanks</Text>
          </View>
        </View>

        {/* Operating Hours Row */}
        <Pressable
          onPress={() =>
            Alert.alert(
              'Operating Shift',
              'Current: Daily 08:00 AM – 08:00 PM\nWard 12 auto-dispatch window.'
            )
          }
          style={styles.shiftRowSimple}>
          <Ionicons name="time-outline" size={17} color={Palette.textSecondary} />
          <Text style={styles.shiftHoursText}>Daily 08:00 AM – 08:00 PM</Text>
          <Ionicons name="chevron-forward" size={16} color={Palette.textSecondary} />
        </Pressable>
      </View>

      {/* 15-MIN EMERGENCY SOS CARD */}
      <View style={styles.sosCard}>
        <Ionicons name="flash" size={18} color="#D97706" />
        <View style={styles.sosTexts}>
          <View style={styles.sosTitleRow}>
            <Text style={styles.sosTitle}>15-Min Emergency SOS</Text>
            <View style={styles.sosExtraBadge}>
              <Text style={styles.sosExtraText}>+₹100</Text>
            </View>
          </View>
          <Text style={styles.sosSub}>
            Opted-in for burst pipes & priority calls
          </Text>
        </View>
        <Switch
          value={partner.sosDispatchEnabled}
          onValueChange={toggleSos}
          trackColor={{ false: Palette.borderDark, true: Palette.secondary }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* PARTNER SUPPORT SECTION */}
      <View style={styles.supportSection}>
        <Text style={styles.supportHeading}>Partner Support</Text>

        {/* Support 1: Muzaffarpur Partner Desk */}
        <Pressable onPress={handleCallSupport} style={styles.supportCardDesk}>
          <View style={styles.deskIconCircle}>
            <MaterialCommunityIcons name="headset" size={20} color={Palette.success} />
          </View>
          <View style={styles.supportDeskTexts}>
            <Text style={styles.deskTitle}>Muzaffarpur Partner Desk</Text>
            <Text style={styles.deskNumber}>Toll-Free 1800–LOCALFIX (24x7)</Text>
          </View>
          <Ionicons name="call-outline" size={18} color={Palette.primary} />
        </Pressable>

        {/* Support 2: Download Partner ID Card */}
        <Pressable onPress={handleDownloadIdCard} style={styles.downloadIdBtn}>
          <MaterialCommunityIcons name="badge-account-horizontal-outline" size={18} color={Palette.secondary} />
          <Text style={styles.downloadIdText}>Download Partner ID Card</Text>
          <Ionicons name="download-outline" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* SUPABASE REALTIME WORKER DATA */}
      <View style={styles.supabaseCard}>
        <View style={styles.supabaseHeaderRow}>
          <View style={styles.supabaseTitleGroup}>
            <MaterialCommunityIcons name="database-sync" size={18} color={Palette.info} />
            <Text style={styles.supabaseCardTitle}>Realtime Worker Pool Rates</Text>
          </View>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveTagText}>Supabase Live</Text>
          </View>
        </View>

        <Text style={styles.supabaseSub}>
          Synchronized to public.worker_profiles table in your district.
        </Text>

        <View style={styles.dbGrid}>
          <View style={styles.dbRow}>
            <Text style={styles.dbKey}>Worker Name</Text>
            <Text style={styles.dbVal}>{workerProfile?.worker_name || partner.name}</Text>
          </View>
          <View style={styles.dbRow}>
            <Text style={styles.dbKey}>Experience</Text>
            <Text style={styles.dbVal}>{workerProfile?.experience_years ?? 5} Years</Text>
          </View>
          <View style={styles.dbRow}>
            <Text style={styles.dbKey}>Hourly Rate</Text>
            <Text style={[styles.dbVal, { color: Palette.successText }]}>
              ₹{workerProfile?.hourly_rate ?? 250}/hr
            </Text>
          </View>
          <View style={styles.dbRow}>
            <Text style={styles.dbKey}>Daily Rate</Text>
            <Text style={[styles.dbVal, { color: Palette.successText }]}>
              ₹{workerProfile?.daily_rate ?? 800}/day
            </Text>
          </View>
          <View style={styles.dbRow}>
            <Text style={styles.dbKey}>Rates Negotiable</Text>
            <Text style={styles.dbVal}>
              {workerProfile?.rates_negotiable !== false ? 'Yes (Flexible)' : 'No (Fixed)'}
            </Text>
          </View>
          <View style={styles.dbRow}>
            <Text style={styles.dbKey}>Verification</Text>
            <Text style={[styles.dbVal, { textTransform: 'capitalize' }]}>
              {workerProfile?.verification_status ?? 'verified'}
            </Text>
          </View>
          <View style={styles.dbRow}>
            <Text style={styles.dbKey}>Availability</Text>
            <Text style={[styles.dbVal, { textTransform: 'capitalize' }]}>
              {workerProfile?.availability_status ?? 'available'}
            </Text>
          </View>
          {user?.email ? (
            <View style={[styles.dbRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.dbKey}>Auth Account</Text>
              <Text style={styles.dbValEmail} numberOfLines={1}>{user.email}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* SIGN OUT BUTTON */}
      <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
        <Ionicons name="log-out-outline" size={18} color={Palette.dangerText} />
        <Text style={styles.signOutBtnText}>Sign Out of Partner Portal</Text>
      </Pressable>

      {/* FOOTER */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Cryptographic ID: MP-PLUMB-9842 · Sec-Patch 2025.1
        </Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  contentContainer: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  photoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Palette.border,
  },
  photoVerifiedCheck: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Palette.surface,
    borderRadius: 8,
  },
  profileDetails: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.primary,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.successBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  inactivePill: {
    backgroundColor: Palette.borderLight,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.success,
  },
  inactiveDot: {
    backgroundColor: Palette.textSecondary,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.successText,
  },
  inactivePillText: {
    color: Palette.textSecondary,
  },
  verifiedPartnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.warningBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  verifiedPartnerText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.warningText,
  },
  ratingStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  dotSeparator: {
    color: Palette.textSecondary,
    marginHorizontal: 2,
  },
  jobsCountText: {
    fontSize: 12,
    color: Palette.primary,
  },
  onTimeText: {
    fontSize: 12,
    color: Palette.success,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.infoBg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greenToggleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.success,
  },
  grayToggleDot: {
    backgroundColor: Palette.textSecondary,
  },
  toggleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  toggleSub: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  geofenceCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeftSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
  },
  municipalLockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.infoBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  municipalLockText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.info,
  },
  mapIllustrationBox: {
    height: 110,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
    backgroundColor: Palette.border,
  },
  mapBackdropImg: {
    width: '100%',
    height: '100%',
  },
  mapOverlayGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(12, 27, 51, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapPinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapCityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  radiusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  radiusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  assignedWardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  assignedWardsText: {
    fontSize: 11,
    color: Palette.primary,
  },
  boldWardText: {
    fontWeight: '700',
  },
  nonTransferableText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  kycCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
  },
  kycSubText: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  certifiedBadge: {
    backgroundColor: Palette.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  certifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.success,
  },
  kycItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.background,
  },
  kycIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  kycItemTexts: {
    flex: 1,
  },
  kycItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  kycItemSub: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  statusVerifiedTag: {
    backgroundColor: Palette.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.success,
  },
  preferencesCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
  },
  editSkillsLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  skillsPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  skillPillItem: {
    backgroundColor: Palette.infoBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.infoText,
  },
  shiftRowSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
  },
  shiftHoursText: {
    fontSize: 12,
    color: Palette.primary,
    flex: 1,
    fontWeight: '500',
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
  },
  sosTexts: {
    flex: 1,
  },
  sosTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  sosTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  sosExtraBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  sosExtraText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  sosSub: {
    fontSize: 10,
    color: Palette.textSecondary,
    lineHeight: 14,
  },
  supportSection: {
    marginBottom: 14,
  },
  supportHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 10,
  },
  supportCardDesk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.infoBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.infoBorder,
    marginBottom: 10,
  },
  deskIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportDeskTexts: {
    flex: 1,
  },
  deskTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  deskNumber: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  downloadIdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  downloadIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  footerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 10,
    color: Palette.textSecondary,
  },
  supabaseCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
  },
  supabaseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  supabaseTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supabaseCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.primary,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.infoBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.info,
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.info,
  },
  supabaseSub: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginBottom: 12,
  },
  dbGrid: {
    backgroundColor: Palette.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  dbRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
  },
  dbKey: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  dbVal: {
    fontSize: 12,
    color: Palette.primary,
    fontWeight: '700',
  },
  dbValEmail: {
    fontSize: 11,
    color: Palette.primary,
    fontWeight: '600',
    maxWidth: '65%',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.dangerBg,
    borderWidth: 1,
    borderColor: Palette.dangerBg,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 14,
  },
  signOutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dangerText,
  },
});
