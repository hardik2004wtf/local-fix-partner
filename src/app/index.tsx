import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePartner } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';

export default function JobsScreen() {
  const router = useRouter();
  const {
    partner,
    toggleOnline,
    jobs,
    acceptJob,
    activeFilter,
    setActiveFilter,
    setIsRegisterModalOpen,
  } = usePartner();

  // Quote input state for job 1
  const [quoteAmount, setQuoteAmount] = useState<number>(350);

  const handleAcceptInstantDispatch = (jobId: string) => {
    acceptJob(jobId, quoteAmount);
    router.push('/active');
  };

  const handleAcceptScheduled = (jobId: string) => {
    acceptJob(jobId, 250);
    router.push('/active');
  };

  const handleSendCustomQuote = (jobId: string) => {
    acceptJob(jobId, 450);
    Alert.alert(
      'Custom Quote Sent',
      'Your quote for ₹450 with 1-hr guaranteed clearance was dispatched to Green View Society!'
    );
    router.push('/active');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Partner Profile Mini-Card */}
      <View style={styles.partnerCard}>
        <View style={styles.partnerTopRow}>
          {/* Avatar initials with verified check */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>RK</Text>
            <View style={styles.avatarCheck}>
              <Ionicons name="checkmark-circle" size={14} color={Palette.success} />
            </View>
          </View>

          {/* Name & Badges */}
          <View style={styles.partnerDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.tradeSub}>Plumbing Specialist</Text>
          </View>

          {/* Online status badge */}
          <Pressable
            onPress={toggleOnline}
            style={[styles.onlinePill, !partner.isOnline && styles.offlinePill]}>
            <View style={[styles.onlineDot, !partner.isOnline && styles.offlineDot]} />
            <Text style={[styles.onlinePillText, !partner.isOnline && styles.offlinePillText]}>
              {partner.isOnline ? 'Online' : 'Offline'}
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* 3 Metric Columns */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Today's Jobs</Text>
            <Text style={styles.metricVal}>{partner.todayJobsCount}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Earnings</Text>
            <Text style={[styles.metricVal, { color: Palette.success }]}>₹{partner.todayEarnings}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Rating</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.metricVal}>{partner.rating}</Text>
              <Ionicons name="star" size={14} color={Palette.secondary} />
            </View>
          </View>
        </View>
      </View>

      {/* Filter Horizontal Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
        <Pressable
          onPress={() => setActiveFilter('all')}
          style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}>
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
            All Broadcasts
          </Text>
          <View style={[styles.countBadge, activeFilter === 'all' && styles.countBadgeActive]}>
            <Text style={[styles.countText, activeFilter === 'all' && styles.countTextActive]}>4</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter('urgent')}
          style={[styles.filterChip, styles.filterChipUrgent, activeFilter === 'urgent' && styles.filterChipActive]}>
          <Ionicons name="flash" size={12} color={Palette.danger} />
          <Text style={styles.urgentFilterText}>Urgent</Text>
          <View style={styles.urgentCountBadge}>
            <Text style={styles.urgentCountText}>1</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter('near')}
          style={[styles.filterChip, activeFilter === 'near' && styles.filterChipActive]}>
          <Ionicons name="navigate-outline" size={13} color={activeFilter === 'near' ? '#FFFFFF' : Palette.textSecondary} />
          <Text style={[styles.filterText, activeFilter === 'near' && styles.filterTextActive]}>Near Me (&lt;3km)</Text>
        </Pressable>
      </ScrollView>

      {/* Section Header: Live Dispatches */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Live Dispatches</Text>
          <View style={styles.radiusPill}>
            <Text style={styles.radiusPillText}>Muzaffarpur 4.5km</Text>
          </View>
        </View>
        <View style={styles.liveAutoRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveAutoText}>Auto-updating</Text>
        </View>
      </View>

      {/* JOB CARD 1: URGENT SINK PIPE BURST */}
      {(activeFilter === 'all' || activeFilter === 'urgent') && (
        <View style={styles.jobCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.urgentTag}>
              <Ionicons name="flash" size={12} color={Palette.danger} />
              <Text style={styles.urgentTagText}>URGENT • 12m ago</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.urgentPriceText}>₹350 – ₹500</Text>
              <Text style={styles.estimateSub}>Instant Estimate</Text>
            </View>
          </View>

          <Text style={styles.jobTitle}>Kitchen Sink Pipe Burst & Valve Seep</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={Palette.textSecondary} />
              <Text style={styles.metaText}>Ayush (Flat A-204)</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={Palette.textSecondary} />
              <Text style={styles.metaText}>2.8 km • Mithanpura</Text>
            </View>
          </View>

          {/* Photos attachments */}
          <View style={styles.photosRow}>
            <View style={styles.photoBox}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80',
                }}
                style={styles.photoImg}
              />
              <View style={styles.photoLabelBox}>
                <Text style={styles.photoLabelText}>Main Joint Crack</Text>
              </View>
            </View>

            <View style={styles.photoBox}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
                }}
                style={styles.photoImg}
              />
              <View style={styles.photoLabelBox}>
                <Text style={styles.photoLabelText}>Valve Thread</Text>
              </View>
            </View>
          </View>

          {/* Direct Quote Offer row */}
          <View style={styles.quoteOfferBox}>
            <View style={styles.quoteOfferHeader}>
              <Text style={styles.quoteOfferTitle}>DIRECT QUOTE</Text>
              <Text style={styles.quoteOfferSub}>No platform commission</Text>
            </View>

            <View style={styles.quoteInputsRow}>
              <View style={styles.quoteInputContainer}>
                <Text style={styles.quoteCurrency}>₹</Text>
                <TextInput
                  style={styles.quoteTextInput}
                  value={quoteAmount.toString()}
                  onChangeText={(val) => setQuoteAmount(parseInt(val) || 0)}
                  keyboardType="numeric"
                />
              </View>

              <Pressable
                onPress={() => setQuoteAmount((prev) => prev + 50)}
                style={styles.quickAddChip}>
                <Text style={styles.quickAddText}>+ ₹50</Text>
              </Pressable>

              <Pressable
                onPress={() => setQuoteAmount((prev) => prev + 100)}
                style={styles.quickAddChip}>
                <Text style={styles.quickAddText}>+ ₹100</Text>
              </Pressable>
            </View>
          </View>

          {/* Action button */}
          <Pressable
            onPress={() => handleAcceptInstantDispatch('LF-8492')}
            style={styles.instantAcceptBtn}>
            <Ionicons name="flash" size={16} color={Palette.surface} />
            <Text style={styles.instantAcceptBtnText}>
              Accept Instant Dispatch (₹{quoteAmount})
            </Text>
          </Pressable>
        </View>
      )}

      {/* JOB CARD 2: SCHEDULED BATHROOM TAP */}
      {(activeFilter === 'all' || activeFilter === 'near') && (
        <View style={styles.jobCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.scheduledTag}>
              <Ionicons name="calendar-outline" size={12} color={Palette.textSecondary} />
              <Text style={styles.scheduledTagText}>Today 2:30 PM</Text>
            </View>
            <View style={styles.priceColumn}>
              <Text style={styles.fixedPriceText}>₹250</Text>
              <Text style={styles.fixedRateLabel}>Fixed Rate</Text>
            </View>
          </View>

          <Text style={styles.jobTitle}>Bathroom Tap Replacement & Angle Valve</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={Palette.textSecondary} />
              <Text style={styles.metaText}>Pooja Sharma</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={Palette.textSecondary} />
              <Text style={styles.metaText}>4.1 km • Brahmpura</Text>
            </View>
          </View>

          {/* Required tool banner */}
          <View style={styles.toolRequirementBox}>
            <MaterialCommunityIcons name="wrench" size={16} color={Palette.warningText} />
            <Text style={styles.toolRequirementText}>
              Tools: 12-inch wrench + PTFE teflon (Parts provided)
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.scheduledActionsRow}>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Job Details',
                  'Client: Pooja Sharma\nTask: Replace bathroom tap & angle valve.\nMaterials already provided by resident.'
                )
              }
              style={styles.viewDetailsBtn}>
              <Ionicons name="information-circle-outline" size={16} color={Palette.primary} />
              <Text style={styles.viewDetailsBtnText}>View Details</Text>
            </Pressable>

            <Pressable
              onPress={() => handleAcceptScheduled('LF-8493')}
              style={styles.acceptJobBtn}>
              <Ionicons name="checkmark" size={16} color={Palette.surface} />
              <Text style={styles.acceptJobBtnText}>Accept Job</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* JOB CARD 3: SOCIETY MAINTENANCE */}
      {activeFilter === 'all' && (
        <View style={styles.jobCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.societyTag}>
              <Text style={styles.societyTagText}>SOCIETY MAINTENANCE</Text>
            </View>
            <View style={styles.priceColumn}>
              <Text style={styles.fixedPriceText}>₹450</Text>
              <Text style={styles.fixedRateLabel}>Standard Payout</Text>
            </View>
          </View>

          <Text style={styles.jobTitle}>Overhead 5000L Water Tank Overflow Sensor</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="office-building" size={14} color={Palette.textSecondary} />
              <Text style={styles.metaText}>Green View Society • Tower C</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={Palette.textSecondary} />
              <Text style={styles.metaText}>1.9 km away</Text>
            </View>
          </View>

          {/* Guaranteed Clearance Box */}
          <View style={styles.clearanceBox}>
            <Ionicons name="shield-checkmark-outline" size={16} color={Palette.success} />
            <Text style={styles.clearanceText}>
              Guaranteed digital payout within 1 hour
            </Text>
          </View>

          {/* Action button */}
          <Pressable
            onPress={() => handleSendCustomQuote('LF-8494')}
            style={styles.sendQuoteBtn}>
            <Ionicons name="paper-plane-outline" size={15} color={Palette.infoText} />
            <Text style={styles.sendQuoteBtnText}>Send Custom Quote</Text>
          </Pressable>
        </View>
      )}

      {/* Footer Protection Banner */}
      <View style={styles.footerProtectionCard}>
        <View style={styles.protectionIconCircle}>
          <MaterialCommunityIcons name="shield-check" size={20} color={Palette.warningText} />
        </View>
        <View style={styles.protectionTextBox}>
          <Text style={styles.protectionTitle}>Muzaffarpur District Protection</Text>
          <Text style={styles.protectionSub}>Only verified local technicians in your radius can bid.</Text>
        </View>
        <View style={styles.protectedBadge}>
          <Ionicons name="checkmark" size={12} color={Palette.success} />
          <Text style={styles.protectedBadgeText}>Protected</Text>
        </View>
      </View>

      <View style={{ height: 20 }} />
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
  partnerCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 14,
  },
  partnerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.info,
  },
  avatarCheck: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Palette.surface,
    borderRadius: 8,
  },
  partnerDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primary,
  },
  proBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  proText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  offlinePill: {
    backgroundColor: Palette.borderLight,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  offlineDot: {
    backgroundColor: Palette.textSecondary,
  },
  onlinePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  offlinePillText: {
    color: Palette.textSecondary,
  },
  tradeSub: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Palette.borderLight,
    marginVertical: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.primary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: Palette.border,
  },
  filterScroll: {
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  filterChipUrgent: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  urgentFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  countBadge: {
    backgroundColor: Palette.border,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.primary,
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  urgentCountBadge: {
    backgroundColor: '#FECACA',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  urgentCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
  },
  radiusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  radiusPillText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
  },
  liveAutoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.secondary,
  },
  liveAutoText: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textSecondary,
  },
  jobCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  urgentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.3,
  },
  urgentPriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#B45309',
  },
  estimateSub: {
    fontSize: 10,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  scheduledTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scheduledTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  societyTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  societyTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  fixedPriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.primary,
  },
  fixedRateLabel: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 6,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  photosRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  photoBox: {
    flex: 1,
    height: 96,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Palette.border,
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  photoLabelBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(12, 27, 51, 0.75)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  photoLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  quoteOfferBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  quoteOfferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteOfferTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
    letterSpacing: 0.5,
  },
  quoteOfferSub: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '500',
  },
  quoteInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quoteInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 38,
  },
  quoteCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginRight: 4,
  },
  quoteTextInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
  },
  quickAddChip: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  instantAcceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.secondary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  instantAcceptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.surface,
  },
  toolRequirementBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  toolRequirementText: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '500',
    flex: 1,
  },
  scheduledActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewDetailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewDetailsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
  },
  acceptJobBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Palette.primary,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptJobBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.surface,
  },
  clearanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  clearanceText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
    flex: 1,
  },
  sendQuoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendQuoteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  footerProtectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 10,
    marginTop: 4,
  },
  protectionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  protectionTextBox: {
    flex: 1,
  },
  protectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  protectionSub: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  protectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  protectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
});
