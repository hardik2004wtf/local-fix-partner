import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { usePartner } from '@/context/PartnerContext';
import { useAuth } from '@/context/AuthContext';
import { Palette } from '@/constants/theme';

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { partner, toggleOnline, setIsRegisterModalOpen } = usePartner();
  const { workerProfile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = workerProfile?.worker_name || partner.name;
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'RK';

  const isJobs = pathname === '/' || pathname === '/index';
  const isActive = pathname === '/active';
  const isProfile = pathname === '/profile';
  const isEarnings = pathname === '/earnings';

  const notifications = [
    { id: '1', title: 'New Urgent Leak Nearby!', desc: 'Kitchen Sink Pipe Burst in Ward 12 (2.8 km away)', time: '12m ago', unread: true },
    { id: '2', title: 'Weekly Bonus Credited', desc: '₹300 District Top-Performer bonus added to payout cycle', time: '2h ago', unread: false },
    { id: '3', title: 'OTP Verified', desc: 'Society gate entry confirmed for Ticket #LF-8492', time: '3h ago', unread: false },
  ];

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        {/* Worker Avatar / Brand Icon */}
        <Pressable onPress={() => router.push('/profile')} style={styles.mascotWrapper}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80' }}
            style={styles.mascotImage}
          />
        </Pressable>

        <View style={styles.titleColumn}>
          {isJobs ? (
            <>
              <Text style={styles.pageTitle}>Jobs Feed</Text>
              <View style={styles.subStatusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.subStatusText}>{partner.city} • {partner.ward}</Text>
              </View>
            </>
          ) : isActive ? (
            <>
              <View style={styles.subStatusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.subStatusText}>Online in {partner.city}</Text>
              </View>
              <Text style={styles.pageTitle}>My Active</Text>
            </>
          ) : isProfile ? (
            <>
              <View style={styles.subStatusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.subStatusText}>Online in {partner.city}</Text>
              </View>
              <Text style={styles.pageTitle}>Profile Credentials</Text>
            </>
          ) : (
            <>
              <View style={styles.subStatusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.subStatusText}>Online in {partner.city}</Text>
              </View>
              <Text style={styles.pageTitle}>Earnings</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Bell Notifications */}
        <Pressable
          onPress={() => setShowNotifications(true)}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <Ionicons name="notifications-outline" size={22} color={Palette.primary} />
          <View style={styles.notifBadge} />
        </Pressable>

        {/* Profile Avatar / Quick Action */}
        <Pressable
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}>
          {isJobs ? (
            <View style={styles.initialsBadge}>
              <Text style={styles.initialsText}>{initials}</Text>
            </View>
          ) : (
            <View style={styles.darkAvatarCircle}>
              <Ionicons name="person" size={17} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      </View>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setShowNotifications(false)}>
          <View style={styles.notifCard}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Notifications & Broadcasts</Text>
              <Pressable onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={20} color={Palette.textSecondary} />
              </Pressable>
            </View>

            {notifications.map((n) => (
              <View key={n.id} style={[styles.notifItem, n.unread && styles.notifItemUnread]}>
                <View style={styles.notifItemTop}>
                  <Text style={styles.notifItemTitle}>{n.title}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
                <Text style={styles.notifDesc}>{n.desc}</Text>
              </View>
            ))}

            <Pressable
              style={styles.createAccountBtn}
              onPress={() => {
                setShowNotifications(false);
                setIsRegisterModalOpen(true);
              }}>
              <Ionicons name="person-add-outline" size={16} color={Palette.warningText} />
              <Text style={styles.createAccountBtnText}>Worker Registration / Account Hub</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mascotWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  subStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.success,
  },
  subStatusText: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: -0.2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.secondary,
  },
  avatarButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.infoBorder,
  },
  initialsText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.info,
  },
  darkAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 27, 51, 0.4)',
    justifyContent: 'flex-start',
    paddingTop: 65,
    paddingHorizontal: 16,
  },
  notifCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    paddingBottom: 8,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
  },
  notifItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.background,
  },
  notifItemUnread: {
    backgroundColor: Palette.warningBg,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  notifItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  notifTime: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  notifDesc: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 16,
  },
  createAccountBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: Palette.warningBorder,
    borderRadius: 8,
  },
  createAccountBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.warningText,
  },
});
