import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartner } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function WithdrawModal({ visible, onClose }: WithdrawModalProps) {
  const { walletBalance, withdrawFunds } = usePartner();
  const [amount, setAmount] = useState(walletBalance.toString());
  const [method, setMethod] = useState<'bank' | 'upi'>('bank');
  const [upiId, setUpiId] = useState('rahul.kumar@sbi');
  const [successInfo, setSuccessInfo] = useState<{ refId: string; amount: number } | null>(null);

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0 || val > walletBalance) return;

    const res = withdrawFunds(val);
    if (res.success) {
      setSuccessInfo({ refId: res.refId, amount: val });
    }
  };

  const handleFinish = () => {
    setSuccessInfo(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {successInfo ? (
            <View style={styles.successWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name="checkmark-done" size={42} color={Palette.success} />
              </View>
              <Text style={styles.successTitle}>Transfer Dispatched!</Text>
              <Text style={styles.successAmount}>₹{successInfo.amount}</Text>
              <Text style={styles.successNote}>
                Sent to State Bank of India (Ending in 4091) via IMPS 24x7. Funds will reflect in under 90 seconds.
              </Text>
              <View style={styles.refBox}>
                <Text style={styles.refLabel}>IMPS Reference No:</Text>
                <Text style={styles.refVal}>{successInfo.refId}</Text>
              </View>
              <Pressable onPress={handleFinish} style={styles.finishBtn}>
                <Text style={styles.finishBtnText}>Done</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.title}>Instant Bank Transfer / UPI</Text>
                  <Text style={styles.subtitle}>Direct IMPS Payout • Zero Municipal Deduction</Text>
                </View>
                <Pressable onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={Palette.textSecondary} />
                </Pressable>
              </View>

              {/* Balance Badge */}
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Available Balance:</Text>
                <Text style={styles.balanceVal}>₹{walletBalance}</Text>
              </View>

              {/* Destination Selector */}
              <Text style={styles.sectionLabel}>Select Payout Channel:</Text>
              <View style={styles.methodRow}>
                <Pressable
                  onPress={() => setMethod('bank')}
                  style={[styles.methodCard, method === 'bank' && styles.methodCardSelected]}>
                  <Ionicons name="business" size={20} color={method === 'bank' ? Palette.secondary : Palette.textSecondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.methodTitle, method === 'bank' && styles.methodTitleSelected]}>
                      State Bank of India
                    </Text>
                    <Text style={styles.methodSub}>Ending in 4091 • Verified ✓</Text>
                  </View>
                  {method === 'bank' && <Ionicons name="checkmark-circle" size={18} color={Palette.secondary} />}
                </Pressable>

                <Pressable
                  onPress={() => setMethod('upi')}
                  style={[styles.methodCard, method === 'upi' && styles.methodCardSelected]}>
                  <Ionicons name="flash" size={20} color={method === 'upi' ? Palette.secondary : Palette.textSecondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.methodTitle, method === 'upi' && styles.methodTitleSelected]}>
                      Instant UPI ID
                    </Text>
                    <Text style={styles.methodSub}>{upiId}</Text>
                  </View>
                  {method === 'upi' && <Ionicons name="checkmark-circle" size={18} color={Palette.secondary} />}
                </Pressable>
              </View>

              {/* Amount input */}
              <View style={styles.inputGroup}>
                <Text style={styles.sectionLabel}>Withdrawal Amount (₹):</Text>
                <View style={styles.amountInputRow}>
                  <Text style={styles.currPrefix}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                  <Pressable onPress={() => setAmount(walletBalance.toString())} style={styles.allBtn}>
                    <Text style={styles.allBtnText}>Max</Text>
                  </Pressable>
                </View>
              </View>

              {/* Zero Fee Guarantee */}
              <View style={styles.guaranteePill}>
                <Ionicons name="shield-checkmark" size={16} color={Palette.success} />
                <Text style={styles.guaranteeText}>
                  Zero fees. 100% of labour + tips dispatched within 90 seconds.
                </Text>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleWithdraw}
                style={[
                  styles.submitBtn,
                  (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance) &&
                    styles.submitBtnDisabled,
                ]}>
                <Ionicons name="flash" size={18} color={Palette.primary} />
                <Text style={styles.submitBtnText}>Confirm Instant Withdrawal</Text>
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
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 13,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  balanceVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.success,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
    marginBottom: 8,
  },
  methodRow: {
    gap: 8,
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  methodCardSelected: {
    borderColor: Palette.secondary,
    backgroundColor: Palette.warningBg,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  methodTitleSelected: {
    color: Palette.warningText,
  },
  methodSub: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderWidth: 1.5,
    borderColor: Palette.borderDark,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  currPrefix: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.primary,
  },
  allBtn: {
    backgroundColor: Palette.warningBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  allBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.warningText,
  },
  guaranteePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.successBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  guaranteeText: {
    fontSize: 11,
    color: Palette.successText,
    flex: 1,
    lineHeight: 15,
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  submitBtnDisabled: {
    backgroundColor: Palette.borderDark,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
  },
  successWrapper: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Palette.successBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.primary,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: Palette.success,
    marginVertical: 4,
  },
  successNote: {
    fontSize: 12,
    color: Palette.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  refBox: {
    backgroundColor: Palette.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 14,
    alignItems: 'center',
  },
  refLabel: {
    fontSize: 10,
    color: Palette.textSecondary,
  },
  refVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  finishBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 10,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
