import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePartner } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';
import WithdrawModal from '@/components/modals/WithdrawModal';

interface DayData {
  day: string;
  amount: number;
  height: number;
  isPeak?: boolean;
  isTwoTone?: boolean;
}

const WEEKLY_DATA: DayData[] = [
  { day: 'Mon', amount: 450, height: 38 },
  { day: 'Tue', amount: 1420, height: 82, isPeak: true },
  { day: 'Wed', amount: 320, height: 26 },
  { day: 'Thu', amount: 510, height: 40 },
  { day: 'Fri', amount: 700, height: 48 },
  { day: 'Sat', amount: 1850, height: 92, isPeak: true, isTwoTone: true },
  { day: 'Sun', amount: 550, height: 42 },
];

export default function EarningsScreen() {
  const { walletBalance, thisWeekEarnings, avgPerJob, bonusEarned, settlements } = usePartner();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('Sat');

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* FINANCIAL OVERVIEW HEADER */}
        <View style={styles.overviewHeaderRow}>
          <View>
            <Text style={styles.overviewSmall}>FINANCIAL OVERVIEW</Text>
            <Text style={styles.overviewTitle}>Earnings & Wallet</Text>
          </View>
          <View style={styles.instantPill}>
            <View style={styles.instantDot} />
            <Text style={styles.instantPillText}>Instant T+0 Active</Text>
          </View>
        </View>

        {/* AVAILABLE FOR WITHDRAWAL CARD */}
        <View style={styles.withdrawalCard}>
          <View style={styles.withdrawableHeader}>
            <View style={styles.withdrawableLabelRow}>
              <Ionicons name="card-outline" size={15} color={Palette.warningText} />
              <Text style={styles.withdrawableLabel}>Available for Withdrawal</Text>
            </View>
            <Pressable
              onPress={() => Alert.alert('Balance Synced', 'Wallet balance is synced with banking nodes.')}
              style={styles.refreshIconBtn}>
              <Ionicons name="sync" size={15} color={Palette.primary} />
            </Pressable>
          </View>

          <View style={styles.balanceAmountRow}>
            <Text style={styles.balanceAmount}>₹{walletBalance.toLocaleString()}</Text>
            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>Ready Now</Text>
            </View>
          </View>

          {/* Linked Bank Container */}
          <View style={styles.bankContainer}>
            <View style={styles.bankIconCircle}>
              <MaterialCommunityIcons name="bank" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.bankTextCol}>
              <Text style={styles.bankName}>State Bank of India</Text>
              <Text style={styles.bankEnding}>Ending in 4091</Text>
            </View>
            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Palette.success} />
              <Text style={styles.verifiedTagText}>Verified</Text>
            </View>
          </View>

          {/* Instant Transfer CTA Button */}
          <Pressable
            onPress={() => setShowWithdrawModal(true)}
            style={({ pressed }) => [styles.transferButton, pressed && { opacity: 0.9 }]}>
            <Ionicons name="flash" size={16} color={Palette.primary} />
            <Text style={styles.transferButtonText}>Instant Bank Transfer / UPI</Text>
          </Pressable>

          <Text style={styles.transferSubtext}>
            Zero fee • Dispatches within 90 seconds via IMPS
          </Text>
        </View>

        {/* 2-COLUMN STATS ROW */}
        <View style={styles.statsRow}>
          {/* Card 1: This Week */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>This Week</Text>
              <View style={styles.statIconBadge}>
                <Ionicons name="calendar-outline" size={14} color={Palette.info} />
              </View>
            </View>
            <Text style={styles.statValue}>₹{thisWeekEarnings.toLocaleString()}</Text>
            <Text style={styles.statSub}>18 Jobs completed</Text>
          </View>

          {/* Card 2: Avg. per Job */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Avg. per Job</Text>
              <View style={styles.statIconBadge}>
                <Ionicons name="trending-up" size={14} color={Palette.info} />
              </View>
            </View>
            <Text style={styles.statValue}>₹{avgPerJob}</Text>
            <Text style={styles.statSubGreen}>+12% vs last week</Text>
          </View>
        </View>

        {/* DISTRICT TOP PERFORMER BONUS BANNER */}
        <View style={styles.bonusBanner}>
          <View style={styles.bonusLeftAccent} />
          <View style={styles.medalCircle}>
            <Ionicons name="medal-outline" size={20} color="#D97706" />
          </View>
          <View style={styles.bonusTexts}>
            <View style={styles.bonusHeaderRow}>
              <Text style={styles.bonusDistrict}>MUZAFFARPUR CENTRAL</Text>
              <View style={styles.bonusAmountTag}>
                <Text style={styles.bonusAmountText}>+₹{bonusEarned}</Text>
              </View>
            </View>
            <Text style={styles.bonusTitle}>District Top-Performer Bonus Earned</Text>
            <Text style={styles.bonusSub}>
              Credited to this payout cycle • Rank #3 in zone
            </Text>
          </View>
        </View>

        {/* WEEKLY TREND BAR CHART CARD */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.chartTitle}>Weekly Trend</Text>
            <View style={styles.daysBadge}>
              <Text style={styles.daysBadgeText}>7 Days</Text>
            </View>
          </View>
          <Text style={styles.chartSubtitle}>
            Peaks on Tuesday (₹1,420) & Saturday (₹1,850)
          </Text>

          {/* Bar Chart Container */}
          <View style={styles.chartFrame}>
            {/* Horizontal Dashed Guideline */}
            <View style={styles.dashedGuideline} />

            {/* Bars */}
            <View style={styles.barsContainer}>
              {WEEKLY_DATA.map((item) => {
                const isSelected = selectedDay === item.day;
                const isTue = item.day === 'Tue';
                const isSat = item.day === 'Sat';

                return (
                  <Pressable
                    key={item.day}
                    onPress={() => setSelectedDay(item.day)}
                    style={styles.barColumn}>
                    {/* Peak indicator dot above Tuesday */}
                    {isTue ? (
                      <View style={styles.peakDotIndicator} />
                    ) : (
                      <View style={styles.peakDotPlaceholder} />
                    )}

                    {/* Bar Pillar */}
                    {isSat ? (
                      // Saturday: Two-tone bar (dark navy with orange cap)
                      <View
                        style={[
                          styles.barTrack,
                          { height: item.height },
                          styles.twoToneBar,
                          isSelected && styles.barSelectedHighlight,
                        ]}>
                        <View style={styles.saturdayOrangeCap} />
                        <View style={styles.saturdayNavyBody} />
                      </View>
                    ) : (
                      // Single color bars
                      <View
                        style={[
                          styles.barTrack,
                          { height: item.height },
                          isTue ? styles.barPeakOrange : styles.barDefaultGray,
                          isSelected && styles.barSelectedHighlight,
                        ]}
                      />
                    )}

                    <Text
                      style={[
                        styles.barDayLabel,
                        (isTue || isSat || isSelected) && styles.barDayLabelBold,
                      ]}>
                      {item.day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Chart Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendOrangeDot} />
              <Text style={styles.legendText}>Peak High Days</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendNavyDot} />
              <Text style={styles.legendText}>Standard Route Dispatch</Text>
            </View>
          </View>
        </View>

        {/* RECENT JOB SETTLEMENTS */}
        <View style={styles.settlementsSection}>
          <View style={styles.settlementsHeaderRow}>
            <Text style={styles.settlementsTitle}>Recent Job Settlements</Text>
            <Pressable
              onPress={() =>
                Alert.alert('Audited Ledger', 'Showing settlements audited & verified by municipal node.')
              }>
              <Text style={styles.viewLedgerLink}>View Ledger</Text>
            </Pressable>
          </View>

          {/* Settlement List */}
          {settlements.map((item, idx) => (
            <View key={item.id} style={styles.settlementItem}>
              <View style={styles.settlementTopRow}>
                {/* Icon box */}
                <View
                  style={[
                    styles.settlementIconSquare,
                    idx === 0 && styles.iconSquareGreen,
                    idx === 1 && styles.iconSquareBlue,
                    idx === 2 && styles.iconSquareCyan,
                  ]}>
                  {item.icon === 'wrench' && (
                    <MaterialCommunityIcons name="wrench" size={17} color={Palette.successText} />
                  )}
                  {item.icon === 'water' && (
                    <MaterialCommunityIcons name="water-pump" size={17} color={Palette.info} />
                  )}
                  {item.icon === 'pump' && (
                    <Ionicons name="water" size={17} color="#0284C7" />
                  )}
                </View>

                {/* Info Column */}
                <View style={styles.settlementDetails}>
                  <View style={styles.settlementNameRow}>
                    <Text style={styles.settlementJobTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.settlementAmount}>+₹{item.amount}</Text>
                  </View>

                  <View style={styles.metaRow}>
                    {idx === 0 && (
                      <View style={styles.upiTag}>
                        <Text style={styles.upiTagText}>{item.paymentType}</Text>
                      </View>
                    )}
                    <Text style={styles.settlementCustomer} numberOfLines={1}>
                      {item.customer} • {item.location}
                    </Text>
                    <Text style={styles.settlementTime}>{item.time}</Text>
                  </View>
                </View>
              </View>

              {/* Settlement Footer */}
              <View style={styles.settlementFooterRow}>
                <View style={styles.receiptRow}>
                  {idx === 0 ? (
                    <>
                      <Ionicons name="receipt-outline" size={12} color={Palette.textSecondary} />
                      <Text style={styles.receiptNumber}>Receipt #{item.receiptNumber}</Text>
                    </>
                  ) : (
                    <Text style={styles.receiptNumber}>{item.paymentType}</Text>
                  )}
                </View>

                <View style={styles.settledBadge}>
                  <Text style={styles.settledBadgeText}>{item.tag}</Text>
                  {idx === 0 && (
                    <Ionicons name="checkmark-circle-outline" size={13} color={Palette.success} />
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* LOCALFIX PARTNER GUARANTEE CARD */}
        <View style={styles.guaranteeCard}>
          <View style={styles.guaranteeTop}>
            <View style={styles.guaranteeIconCircle}>
              <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.guaranteeHeading}>LocalFix Partner Guarantee</Text>
          </View>
          <Text style={styles.guaranteeBody}>
            0% deduction on basic labour charges. 100% of customer tips and municipal rates go directly to your account.
          </Text>
          <View style={styles.guaranteePillsRow}>
            <View style={styles.pillItem}>
              <Ionicons name="shield-outline" size={12} color={Palette.warningText} />
              <Text style={styles.pillItemText}>Zero Hidden Fees</Text>
            </View>
            <View style={styles.pillItem}>
              <Ionicons name="help-circle-outline" size={12} color={Palette.warningText} />
              <Text style={styles.pillItemText}>Dispute Support</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Withdrawal Modal */}
      <WithdrawModal
        visible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  overviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textSecondary,
    letterSpacing: 0.5,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.primary,
    marginTop: 1,
  },
  instantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.infoBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  instantDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.secondary,
  },
  instantPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.info,
  },
  withdrawalCard: {
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
  withdrawableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  withdrawableLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  withdrawableLabel: {
    fontSize: 12,
    color: Palette.primary,
    fontWeight: '500',
  },
  refreshIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Palette.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.primary,
  },
  readyBadge: {
    backgroundColor: Palette.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  readyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.successText,
  },
  bankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.infoBg,
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  bankIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bankTextCol: {
    flex: 1,
  },
  bankName: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  bankEnding: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.successText,
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.secondary,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: Palette.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  transferButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.primary,
  },
  transferSubtext: {
    fontSize: 11,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  statIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Palette.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.primary,
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  statSubGreen: {
    fontSize: 11,
    color: Palette.successText,
    fontWeight: '700',
  },
  bonusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 14,
  },
  bonusLeftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Palette.secondary,
  },
  medalCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.warningBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 4,
  },
  bonusTexts: {
    flex: 1,
  },
  bonusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  bonusDistrict: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.warningText,
    letterSpacing: 0.3,
  },
  bonusAmountTag: {
    backgroundColor: Palette.warningBg,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  bonusAmountText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.warningText,
  },
  bonusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  bonusSub: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  chartCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
  },
  daysBadge: {
    backgroundColor: Palette.infoBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  daysBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.info,
  },
  chartSubtitle: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  chartFrame: {
    position: 'relative',
    height: 125,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    paddingBottom: 8,
  },
  dashedGuideline: {
    position: 'absolute',
    left: 4,
    right: 4,
    top: 42,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    borderStyle: 'dashed',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  peakDotIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Palette.secondary,
    marginBottom: 4,
  },
  peakDotPlaceholder: {
    width: 5,
    height: 5,
    marginBottom: 4,
  },
  barTrack: {
    width: 20,
    borderRadius: 5,
  },
  barDefaultGray: {
    backgroundColor: Palette.borderDark,
  },
  barPeakOrange: {
    backgroundColor: Palette.secondary,
  },
  twoToneBar: {
    overflow: 'hidden',
  },
  saturdayOrangeCap: {
    height: 12,
    backgroundColor: Palette.secondary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  saturdayNavyBody: {
    flex: 1,
    backgroundColor: Palette.primary,
  },
  barSelectedHighlight: {
    borderWidth: 1.5,
    borderColor: Palette.info,
  },
  barDayLabel: {
    fontSize: 10,
    color: Palette.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  barDayLabelBold: {
    fontWeight: '700',
    color: Palette.primary,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendOrangeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.secondary,
  },
  legendNavyDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.primary,
  },
  legendText: {
    fontSize: 10,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  settlementsSection: {
    marginBottom: 14,
  },
  settlementsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settlementsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
  },
  viewLedgerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.warningText,
  },
  settlementItem: {
    backgroundColor: Palette.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 10,
  },
  settlementTopRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  settlementIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSquareGreen: {
    backgroundColor: Palette.successBg,
  },
  iconSquareBlue: {
    backgroundColor: Palette.infoBg,
  },
  iconSquareCyan: {
    backgroundColor: '#E0F2FE',
  },
  settlementDetails: {
    flex: 1,
  },
  settlementNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementJobTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
    flex: 1,
    paddingRight: 6,
  },
  settlementAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.successText,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  upiTag: {
    backgroundColor: Palette.successBg,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  upiTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.successText,
  },
  settlementCustomer: {
    fontSize: 11,
    color: Palette.textSecondary,
    flex: 1,
  },
  settlementTime: {
    fontSize: 10,
    color: Palette.textSecondary,
  },
  settlementFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  receiptNumber: {
    fontSize: 10,
    color: Palette.textSecondary,
  },
  settledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settledBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.successText,
  },
  guaranteeCard: {
    backgroundColor: Palette.infoBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.infoBorder,
  },
  guaranteeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  guaranteeIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guaranteeHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  guaranteeBody: {
    fontSize: 11,
    color: Palette.primary,
    lineHeight: 16,
    marginBottom: 10,
  },
  guaranteePillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillItemText: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.warningText,
  },
});
