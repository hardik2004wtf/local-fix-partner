import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartner } from '@/context/PartnerContext';
import { Palette } from '@/constants/theme';

interface AddMaterialModalProps {
  visible: boolean;
  onClose: () => void;
}

const COMMON_MATERIALS = [
  { name: 'PTFE Teflon Tape Roll', cost: 30 },
  { name: '1/2" Brass Hex Nipple', cost: 75 },
  { name: 'PVC Flexible Waste Pipe 32mm', cost: 110 },
  { name: 'Heavy Brass Coupling + PTFE Tape', cost: 120 },
  { name: 'SS 304 Braided Connection Hose (450mm)', cost: 180 },
  { name: 'Angle Valve Heavy Chrome Plated', cost: 240 },
];

export default function AddMaterialModal({ visible, onClose }: AddMaterialModalProps) {
  const { addExtraMaterial } = usePartner();
  const [materialName, setMaterialName] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSelectPreset = (item: { name: string; cost: number }) => {
    setSelectedPreset(item.name);
    setMaterialName(item.name);
    setMaterialCost(item.cost.toString());
  };

  const handleAdd = () => {
    if (!materialName.trim() || !materialCost.trim()) return;
    const cost = parseFloat(materialCost);
    if (isNaN(cost) || cost <= 0) return;

    addExtraMaterial(materialName.trim(), cost);
    setMaterialName('');
    setMaterialCost('');
    setSelectedPreset(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleGroup}>
              <Text style={styles.title}>Add Extra Part / Material</Text>
              <Text style={styles.subtitle}>Directly updates pre-tax draft bill for resident approval</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Palette.textSecondary} />
            </Pressable>
          </View>

          {/* Quick Preset Selector */}
          <Text style={styles.sectionLabel}>Frequently Used Consumables (Muzaffarpur Rates):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {COMMON_MATERIALS.map((item, idx) => {
              const isSelected = selectedPreset === item.name;
              return (
                <Pressable
                  key={idx}
                  onPress={() => handleSelectPreset(item)}
                  style={[styles.presetChip, isSelected && styles.presetChipSelected]}>
                  <Text style={[styles.presetName, isSelected && styles.presetTextSelected]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.presetPrice, isSelected && styles.presetPriceSelected]}>
                    ₹{item.cost}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Custom Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Item / Part Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Heavy Brass Coupling 1/2 inch"
              placeholderTextColor={Palette.textSecondary}
              value={materialName}
              onChangeText={(txt) => {
                setMaterialName(txt);
                setSelectedPreset(null);
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Unit Cost (₹ INR)</Text>
            <View style={styles.costInputRow}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={[styles.input, styles.costInput]}
                placeholder="120"
                placeholderTextColor={Palette.textSecondary}
                keyboardType="numeric"
                value={materialCost}
                onChangeText={(txt) => {
                  setMaterialCost(txt);
                  setSelectedPreset(null);
                }}
              />
            </View>
          </View>

          {/* Transparency Guarantee Note */}
          <View style={styles.guaranteeBox}>
            <Ionicons name="shield-checkmark" size={16} color={Palette.success} />
            <Text style={styles.guaranteeText}>
              100% of material cost is reimbursed without commission deduction.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleAdd}
              style={[
                styles.submitBtn,
                (!materialName.trim() || !materialCost.trim()) && styles.submitBtnDisabled,
              ]}>
              <Text style={styles.submitBtnText}>Add to Job Bill</Text>
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
    backgroundColor: 'rgba(12, 27, 51, 0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleGroup: {
    flex: 1,
    paddingRight: 10,
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
    marginBottom: 8,
  },
  presetScroll: {
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'flex-start',
  },
  presetChipSelected: {
    backgroundColor: Palette.warningBg,
    borderColor: Palette.secondary,
  },
  presetName: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
    marginBottom: 2,
  },
  presetTextSelected: {
    color: Palette.warningText,
  },
  presetPrice: {
    fontSize: 11,
    color: Palette.success,
    fontWeight: '700',
  },
  presetPriceSelected: {
    color: Palette.secondary,
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
  input: {
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Palette.primary,
  },
  costInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginRight: 6,
  },
  costInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  guaranteeBox: {
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
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Palette.borderLight,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.primary,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Palette.secondary,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: Palette.borderDark,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
  },
});
