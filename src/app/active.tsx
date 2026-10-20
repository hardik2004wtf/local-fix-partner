import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePartner } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';
import AddMaterialModal from '@/components/modals/AddMaterialModal';
import SignOffModal from '@/components/modals/SignOffModal';

export default function ActiveJobScreen() {
  const { activeTicket, setCallingCustomer } = usePartner();
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showSignOff, setShowSignOff] = useState(false);

  // Format execution clock (HH:MM:SS)
  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const totalExtra = activeTicket.extraMaterials.reduce((acc, m) => acc + m.cost, 0);
  const totalAmount = activeTicket.labourCost + totalExtra;
  const completedCount = activeTicket.status === 'COMPLETED' ? 5 : 3;

  return (
    <View style={styles.screenWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* TICKET TOP CARD */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeaderRow}>
            <View style={styles.ticketInfoRow}>
              <Text style={styles.ticketNumber}>{activeTicket.id}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.ticketCategory}>Plumbing Diagnostic</Text>
            </View>

            <View style={styles.inProgressPill}>
              <View style={styles.inProgressDot} />
              <Text style={styles.inProgressText}>
                {activeTicket.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
              </Text>
            </View>
          </View>

          {/* Customer info & avatar */}
          <View style={styles.customerInfoRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }}
              style={styles.customerAvatar}
            />
            <View style={styles.customerTexts}>
              <Text style={styles.customerName}>{activeTicket.customerName}</Text>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={13} color={Palette.textSecondary} />
                <Text style={styles.addressText} numberOfLines={1}>
                  {activeTicket.customerAddress}
                </Text>
              </View>
            </View>
          </View>

          {/* Action buttons (Call & Map) */}
          <View style={styles.ticketActionsRow}>
            <Pressable
              onPress={() => setCallingCustomer(true)}
              style={styles.callButton}>
              <Ionicons name="call" size={15} color={Palette.primary} />
              <Text style={styles.callButtonText}>Call {activeTicket.customerName.split(' ')[0]}</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Directions',
                  'Navigating to ABC Heights, Flat A-204, Mithanpura. Estimated arrival: 3 min (0.4 km away).'
                )
              }
              style={styles.mapButton}>
              <Ionicons name="navigate" size={15} color={Palette.secondary} />
              <Text style={styles.mapButtonText}>Open Map (3m)</Text>
            </Pressable>
          </View>
        </View>

        {/* TWO-COLUMN METRICS: PIN HANDSHAKE & EXECUTION CLOCK */}
        <View style={styles.twoColRow}>
          {/* PIN Handshake Card */}
          <View style={styles.metricCardHalf}>
            <View style={styles.pinIconCircle}>
              <Ionicons name="checkmark-circle" size={20} color={Palette.success} />
            </View>
            <View style={styles.metricTextsCol}>
              <Text style={styles.metricSubLabel}>PIN HANDSHAKE</Text>
              <View style={styles.pinValRow}>
                <Text style={styles.pinLargeVal}>{activeTicket.pin}</Text>
                <View style={styles.verifiedGreenBadge}>
                  <Text style={styles.verifiedGreenText}>VERIFIED</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Execution Clock Card */}
          <View style={styles.metricCardHalf}>
            <View style={styles.clockIconBox}>
              <Ionicons name="stopwatch" size={18} color={Palette.secondary} />
            </View>
            <View style={styles.metricTextsCol}>
              <Text style={styles.metricSubLabel}>EXECUTION CLOCK</Text>
              <Text style={styles.clockLargeVal}>{formatTimer(activeTicket.executionSeconds)}</Text>
            </View>
          </View>
        </View>

        {/* JOB PROGRESS CARD */}
        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>Job Progress</Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>Step 3 of 5</Text>
            </View>
          </View>

          {/* Checklist Items */}
          <View style={styles.checklistTimeline}>
            {/* Step 1: Dispatched */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.stepCircleDone}>
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                </View>
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.stepTitleRow}>
                  <Text style={styles.stepTitle}>Dispatched to Location</Text>
                  <Text style={styles.stepTime}>09:30 AM</Text>
                </View>
                <Text style={styles.stepDesc}>Confirmed route from Mithanpura</Text>
              </View>
            </View>

            {/* Step 2: Arrived */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.stepCircleDone}>
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                </View>
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.stepTitleRow}>
                  <Text style={styles.stepTitle}>Arrived & Resident Handshake</Text>
                  <Text style={styles.stepTime}>09:48 AM</Text>
                </View>
                <Text style={styles.stepDesc}>Gate pass and OTP validated</Text>
              </View>
            </View>

            {/* Step 3: Kitchen Sink Pipe Replacement */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.stepCircleActive}>
                  <MaterialCommunityIcons name="wrench" size={13} color="#FFFFFF" />
                </View>
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.stepTitleRow}>
                  <Text style={styles.stepTitle}>Kitchen Sink Pipe Replacement</Text>
                  <View style={styles.ongoingBadge}>
                    <Text style={styles.ongoingText}>10:00 AM (Ongoing)</Text>
                  </View>
                </View>
                <Text style={styles.stepDesc}>P-trap disassembled, main inlet valve sealed</Text>

                {/* Photo thumbnail attachment */}
                <View style={styles.thumbBox}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=200&q=80',
                    }}
                    style={styles.thumbImg}
                  />
                  <Text style={styles.thumbCaption}>
                    Diagnostic photo logged before repair.
                  </Text>
                </View>
              </View>
            </View>

            {/* Step 4: Extra Consumables */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.stepCircleBox}>
                  <MaterialCommunityIcons name="calendar-text-outline" size={13} color={Palette.textSecondary} />
                </View>
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.stepTitleRow}>
                  <Text style={styles.stepTitle}>Extra Consumables</Text>
                  <Text style={styles.stepCount}>1 Item</Text>
                </View>

                {/* List of added materials */}
                <View style={styles.materialRow}>
                  <MaterialCommunityIcons name="lightning-bolt" size={14} color={Palette.secondary} />
                  <Text style={styles.materialName} numberOfLines={1}>
                    Heavy Brass Coupling + PTFE Tape
                  </Text>
                  <Text style={styles.materialPrice}>₹120</Text>
                </View>

                {/* Add Extra Part Button */}
                <Pressable
                  onPress={() => setShowAddMaterial(true)}
                  style={styles.addPartBtn}>
                  <Ionicons name="add-circle-outline" size={16} color={Palette.primary} />
                  <Text style={styles.addPartBtnText}>Add Extra Part / Material</Text>
                </Pressable>
              </View>
            </View>

            {/* Step 5: Resident Sign-off & Completion */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.stepCirclePending}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={15}
                    color={Palette.borderDark}
                  />
                </View>
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.stepTitleRow}>
                  <Text style={styles.stepTitlePending}>Resident Sign-off & Completion</Text>
                  <Text style={styles.stepPendingText}>Pending</Text>
                </View>
                <Text style={styles.stepDesc}>
                  Pressure flow test and digital client sign-off
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* LOCATION MAP CARD */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeaderRow}>
            <Text style={styles.mapTitle}>Location Map</Text>
            <View style={styles.liveGpsBadge}>
              <View style={styles.liveGpsDot} />
              <Text style={styles.liveGpsText}>Live GPS</Text>
            </View>
          </View>

          {/* Map Preview Graphic */}
          <View style={styles.mapContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=80',
              }}
              style={styles.mapGraphic}
            />
            {/* Map Overlay Badge */}
            <View style={styles.mapPinBadge}>
              <Ionicons name="warning-outline" size={13} color={Palette.secondary} />
              <Text style={styles.mapPinText}>ABC Heights • Tower A</Text>
            </View>
          </View>
        </View>

        {/* ESTIMATED BILL CARD */}
        <View style={styles.billCard}>
          <View style={styles.billHeaderRow}>
            <Text style={styles.billTitle}>Estimated Bill</Text>
            <View style={styles.draftBadge}>
              <Text style={styles.draftBadgeText}>Pre-tax Draft</Text>
            </View>
          </View>

          <View style={styles.billItemRow}>
            <Text style={styles.billItemLabel}>Standard Plumbing Diagnostic Labour</Text>
            <Text style={styles.billItemValue}>₹250.00</Text>
          </View>

          <View style={styles.billItemRow}>
            <Text style={styles.billItemLabel}>Extra Material (Brass Coupling)</Text>
            <Text style={styles.billItemValue}>₹120.00</Text>
          </View>

          <View style={styles.billItemRow}>
            <Text style={styles.billItemLabel}>Convenience Fee</Text>
            <Text style={styles.freeFeeText}>FREE</Text>
          </View>

          {/* Total Box */}
          <View style={styles.totalBox}>
            <View>
              <Text style={styles.totalDueLabel}>TOTAL AMOUNT DUE</Text>
              <Text style={styles.totalDueVal}>₹370.00</Text>
            </View>

            <View style={styles.upiQrBox}>
              <MaterialCommunityIcons name="qrcode" size={24} color={Palette.primary} />
              <View>
                <Text style={styles.upiQrText}>Instant UPI QR</Text>
                <Text style={styles.upiQrSub}>Ready at sign-off</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mark Completed & Request Sign-Off Button */}
        <Pressable
          onPress={() => setShowSignOff(true)}
          style={styles.signOffBtn}>
          <MaterialCommunityIcons name="clipboard-check-outline" size={18} color={Palette.primary} />
          <Text style={styles.signOffBtnText}>Mark Completed & Request Sign-Off</Text>
        </Pressable>

        <View style={styles.subtextRow}>
          <Ionicons name="checkmark-circle-outline" size={13} color={Palette.success} />
          <Text style={styles.subtextNote}>
            Resident OTP / digital touch approval required on completion
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Add Material Modal */}
      <AddMaterialModal
        visible={showAddMaterial}
        onClose={() => setShowAddMaterial(false)}
      />

      {/* Resident Sign Off Modal */}
      <SignOffModal
        visible={showSignOff}
        onClose={() => setShowSignOff(false)}
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
  },
  ticketCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 12,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.primary,
  },
  dotSeparator: {
    color: Palette.textSecondary,
  },
  ticketCategory: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  inProgressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  inProgressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.secondary,
  },
  inProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  customerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  customerTexts: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 11,
    color: Palette.textSecondary,
    flex: 1,
  },
  ticketActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 8,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metricCardHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  pinIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTextsCol: {
    flex: 1,
  },
  metricSubLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  pinValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinLargeVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 1,
  },
  verifiedGreenBadge: {
    backgroundColor: Palette.successBg,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedGreenText: {
    fontSize: 8,
    fontWeight: '800',
    color: Palette.successText,
    letterSpacing: 0.5,
  },
  clockLargeVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  checklistCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 12,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
  },
  progressBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  progressBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  ongoingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ongoingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  stepTitlePending: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  upiQrSub: {
    fontSize: 9,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  checklistTimeline: {},
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 22,
  },
  stepCircleDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.borderLight,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCirclePending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.background,
    borderWidth: 1.5,
    borderColor: Palette.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: Palette.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 4,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  stepTime: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  stepTimeOngoing: {
    fontSize: 11,
    color: Palette.secondary,
    fontWeight: '700',
  },
  stepCount: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  stepPendingText: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  stepDesc: {
    fontSize: 11,
    color: Palette.textSecondary,
    lineHeight: 15,
  },
  thumbBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.background,
    padding: 6,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  thumbImg: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  thumbCaption: {
    fontSize: 11,
    color: Palette.primary,
    flex: 1,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  materialName: {
    fontSize: 12,
    color: Palette.primary,
    fontWeight: '500',
    flex: 1,
  },
  materialPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  addPartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.infoBg,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  addPartBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.infoText,
  },
  mapCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 12,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
  },
  liveGpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveGpsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.success,
  },
  liveGpsText: {
    fontSize: 11,
    color: Palette.successText,
    fontWeight: '600',
  },
  mapContainer: {
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Palette.border,
  },
  mapGraphic: {
    width: '100%',
    height: '100%',
  },
  mapPinBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPinText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  billCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 14,
  },
  billHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
  },
  draftBadge: {
    backgroundColor: Palette.infoBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  draftBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.info,
  },
  billItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billItemLabel: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  extraMaterialLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  billItemValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  freeFeeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.success,
  },
  billDivider: {
    height: 1,
    backgroundColor: Palette.borderLight,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalDueLabel: {
    fontSize: 10,
    color: Palette.textSecondary,
    fontWeight: '700',
  },
  totalDueVal: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.primary,
    marginTop: 2,
  },
  upiQrBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  upiQrText: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.primary,
    maxWidth: 90,
  },
  signOffBtn: {
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
    shadowRadius: 5,
    elevation: 3,
  },
  signOffBtnCompleted: {
    backgroundColor: Palette.success,
  },
  signOffBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
  },
  subtextNote: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
});
