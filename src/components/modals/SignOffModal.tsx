import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePartner } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';

interface SignOffModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SignOffModal({ visible, onClose }: SignOffModalProps) {
  const router = useRouter();
  const { activeTicket, completeActiveJob } = usePartner();
  const [otp, setOtp] = useState('7392');
  const [hasSigned, setHasSigned] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const totalExtra = activeTicket.extraMaterials.reduce((acc, m) => acc + m.cost, 0);
  const totalAmount = activeTicket.labourCost + totalExtra;

  const handleVerify = () => {
    if (!otp || otp.length < 4) {
      setErrorMsg('Please enter the 4-digit OTP provided by the resident.');
      return;
    }
    const success = completeActiveJob(otp);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        router.push('/earnings');
      }, 1500);
    } else {
      setErrorMsg('Invalid OTP. Please ask resident for the 4-digit closure PIN.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-done" size={48} color={Palette.success} />
              </View>
              <Text style={styles.successTitle}>Job Completed & Settled!</Text>
              <Text style={styles.successAmount}>+₹{totalAmount}.00</Text>
              <Text style={styles.successSub}>
                Instant payout credited to your wallet via UPI Direct.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.title}>Resident Sign-Off & Closure</Text>
                  <Text style={styles.subtitle}>{activeTicket.id} • {activeTicket.customerName}</Text>
                </View>
                <Pressable onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={Palette.textSecondary} />
                </Pressable>
              </View>

              {/* Amount Summary Box */}
              <View style={styles.amountBox}>
                <View>
                  <Text style={styles.amountLabel}>Total Bill Due</Text>
                  <Text style={styles.amountVal}>₹{totalAmount}.00</Text>
                </View>
                <View style={styles.qrBadge}>
                  <Ionicons name="qr-code" size={28} color={Palette.primary} />
                  <Text style={styles.qrText}>Instant UPI QR</Text>
                </View>
              </View>

              {/* Step 1: Resident OTP */}
              <View style={styles.sectionBox}>
                <Text style={styles.stepTitle}>1. Resident Completion OTP</Text>
                <Text style={styles.stepHint}>Ask {activeTicket.customerName} for the 4-digit closure PIN</Text>
                <View style={styles.otpRow}>
                  <TextInput
                    style={styles.otpInput}
                    value={otp}
                    onChangeText={(val) => {
                      setOtp(val);
                      setErrorMsg('');
                    }}
                    placeholder="7392"
                    placeholderTextColor={Palette.textSecondary}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                  <View style={styles.pinHintBadge}>
                    <Ionicons name="information-circle" size={14} color={Palette.successText} />
                    <Text style={styles.pinHintText}>Demo PIN: 7392</Text>
                  </View>
                </View>
                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
              </View>

              {/* Step 2: Digital Touch Signature */}
              <View style={styles.sectionBox}>
                <View style={styles.sigHeaderRow}>
                  <Text style={styles.stepTitle}>2. Resident Digital Signature</Text>
                  <Pressable onPress={() => setHasSigned(!hasSigned)}>
                    <Text style={styles.sigActionText}>{hasSigned ? 'Clear' : 'Simulate Sign'}</Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => setHasSigned(true)}
                  style={[styles.sigPad, hasSigned && styles.sigPadSigned]}>
                  {hasSigned ? (
                    <View style={styles.signedContent}>
                      <Text style={styles.signatureScript}>Ayush Verma</Text>
                      <Text style={styles.sigTimestamp}>Timestamp: 10:48 AM IST • Biometric Touch OK</Text>
                    </View>
                  ) : (
                    <View style={styles.emptySigContent}>
                      <Ionicons name="create-outline" size={20} color={Palette.textSecondary} />
                      <Text style={styles.emptySigText}>Tap here to simulate resident sign-off</Text>
                    </View>
                  )}
                </Pressable>
              </View>

              {/* Verification Button */}
              <Pressable
                onPress={handleVerify}
                style={[styles.confirmBtn, (!otp || !hasSigned) && styles.confirmBtnDisabled]}>
                <Ionicons name="shield-checkmark" size={18} color={Palette.primary} />
                <Text style={styles.confirmBtnText}>
                  Verify & Settle Payout (₹{totalAmount})
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 27, 51, 0.65)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.primary,
  },
  subtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  amountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  amountVal: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.primary,
    marginTop: 2,
  },
  qrBadge: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  qrText: {
    fontSize: 9,
    fontWeight: '600',
    color: Palette.primary,
    marginTop: 2,
  },
  sectionBox: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  stepHint: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  otpInput: {
    backgroundColor: Palette.borderLight,
    borderWidth: 1.5,
    borderColor: Palette.secondary,
    borderRadius: 10,
    width: 120,
    height: 48,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: Palette.primary,
    letterSpacing: 4,
  },
  pinHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.successBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pinHintText: {
    fontSize: 11,
    color: Palette.successText,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: Palette.dangerText,
    marginTop: 6,
  },
  sigHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sigActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.info,
  },
  sigPad: {
    height: 90,
    backgroundColor: Palette.background,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.borderDark,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sigPadSigned: {
    borderColor: Palette.success,
    backgroundColor: Palette.successBg,
    borderStyle: 'solid',
  },
  emptySigContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptySigText: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  signedContent: {
    alignItems: 'center',
  },
  signatureScript: {
    fontSize: 24,
    fontStyle: 'italic',
    color: Palette.primary,
    fontWeight: '600',
  },
  sigTimestamp: {
    fontSize: 10,
    color: Palette.successText,
    marginTop: 4,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.secondary,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  confirmBtnDisabled: {
    backgroundColor: Palette.borderDark,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.successBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.primary,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: Palette.success,
    marginVertical: 6,
  },
  successSub: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
