import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartner } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';

export default function CallCustomerModal() {
  const { callingCustomer, setCallingCustomer, activeTicket } = usePartner();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    let timer: any;
    if (callingCustomer) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callingCustomer]);

  if (!callingCustomer) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Modal visible={callingCustomer} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header Tag */}
          <View style={styles.tagRow}>
            <View style={styles.verifiedPill}>
              <Ionicons name="checkmark-circle" size={14} color={Palette.successText} />
              <Text style={styles.verifiedText}>Encrypted Partner VoIP Call</Text>
            </View>
          </View>

          {/* Customer Avatar & Details */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: activeTicket.customerAvatar }}
              style={styles.avatar}
            />
            <View style={styles.onlinePulse} />
          </View>

          <Text style={styles.customerName}>{activeTicket.customerName}</Text>
          <Text style={styles.customerSub}>{activeTicket.customerPhone}</Text>
          <Text style={styles.ticketBadge}>{activeTicket.id} • {activeTicket.category}</Text>
          <Text style={styles.addressText}>{activeTicket.customerAddress}</Text>

          {/* Call Status & Timer */}
          <View style={styles.timerContainer}>
            <View style={styles.recordingDot} />
            <Text style={styles.callTimer}>
              Connected: {formatTime(callDuration)}
            </Text>
          </View>

          {/* Quick Discussion Notes */}
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>📌 Quick Customer Request Details:</Text>
            <Text style={styles.notesText}>
              • Main inlet valve leaking under kitchen sink{'\n'}
              • Society gate pass code: 4821 (Handshake verified){'\n'}
              • Resident confirmed available in Flat A-204
            </Text>
          </View>

          {/* In-Call Controls */}
          <View style={styles.controlsRow}>
            <Pressable
              onPress={() => setIsMuted(!isMuted)}
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}>
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={22}
                color={isMuted ? '#FFFFFF' : Palette.primary}
              />
              <Text style={[styles.controlLabel, isMuted && styles.controlLabelActive]}>
                {isMuted ? 'Muted' : 'Mute'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setIsSpeaker(!isSpeaker)}
              style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}>
              <Ionicons
                name={isSpeaker ? 'volume-high' : 'volume-medium'}
                size={22}
                color={isSpeaker ? '#FFFFFF' : Palette.primary}
              />
              <Text style={[styles.controlLabel, isSpeaker && styles.controlLabelActive]}>
                {isSpeaker ? 'Speaker ON' : 'Speaker'}
              </Text>
            </Pressable>

            {/* End Call Button */}
            <Pressable
              onPress={() => setCallingCustomer(false)}
              style={styles.endCallBtn}>
              <Ionicons name="call" size={26} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 27, 51, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Palette.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  tagRow: {
    marginBottom: 16,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.successBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  verifiedText: {
    fontSize: 12,
    color: Palette.successText,
    fontWeight: '600',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Palette.secondary,
  },
  onlinePulse: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.success,
    borderWidth: 2,
    borderColor: Palette.surface,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.primary,
  },
  customerSub: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  ticketBadge: {
    fontSize: 12,
    color: Palette.warningText,
    fontWeight: '600',
    backgroundColor: Palette.warningBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 8,
  },
  addressText: {
    fontSize: 12,
    color: Palette.primary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 10,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
    marginBottom: 14,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.success,
  },
  callTimer: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  notesBox: {
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 11,
    color: Palette.primary,
    lineHeight: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnActive: {
    backgroundColor: Palette.primary,
  },
  controlLabel: {
    fontSize: 9,
    color: Palette.textSecondary,
    marginTop: 3,
  },
  controlLabelActive: {
    color: '#FFFFFF',
  },
  endCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.danger,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
