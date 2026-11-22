import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Car,
  Calendar,
  ShoppingBag,
  Sparkles,
  User,
  MessageSquare,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Flame,
} from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { PREVIEW_USER, PREVIEW_LOYALTY } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun MELTUNE AUTO?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => router.push('/(auth)/login'),
        },
      ]
    );
  };

  const menuSections = [
    {
      title: 'AKTIVITAS WORKSHOP',
      items: [
        {
          id: 'garage',
          label: 'Garasi Kendaraan Saya',
          subtitle: 'Spesifikasi mesin & rekomendasi oli',
          icon: Car,
          onPress: () => router.push('/garage'),
        },
        {
          id: 'booking_history',
          label: 'Riwayat Reservasi Servis',
          subtitle: 'Log kedatangan workbay & catatan mekanik',
          icon: Calendar,
          onPress: () => router.push('/booking/history'),
        },
        {
          id: 'orders',
          label: 'Pesanan Suku Cadang',
          subtitle: 'Status pengiriman & pengambilan toko',
          icon: ShoppingBag,
          onPress: () => router.push('/shop/orders'),
        },
      ],
    },
    {
      title: 'PROGRAM KEANGGOTAAN',
      items: [
        {
          id: 'loyalty',
          label: 'Daily Streak & Reward Poin',
          subtitle: `${PREVIEW_LOYALTY.points} Poin siap ditukar voucher`,
          icon: Sparkles,
          onPress: () => router.push('/loyalty'),
        },
      ],
    },
    {
      title: 'PENGATURAN & LAYANAN KONSULTASI',
      items: [
        {
          id: 'edit_profile',
          label: 'Edit Informasi Profil',
          subtitle: 'Nama, nomor telepon, dan preferensi',
          icon: User,
          onPress: () => router.push('/profile/edit'),
        },
        {
          id: 'support',
          label: 'Pusat Bantuan & Service Advisor',
          subtitle: 'Konsultasi teknis dengan advisor workshop',
          icon: MessageSquare,
          onPress: () => router.push('/support'),
        },
      ],
    },
  ];

  return (
    <AmbientGradientBackground preset="profileLuxury">
      <AppHeader
        title="Profil Pengemudi"
        subtitle="Identitas & Status Keanggotaan Meltune Auto"
        tag="CUSTOMER ID // 01"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 90 + Spacing.xxl },
        ]}
      >
        {/* Profile Card Header */}
        <View style={[styles.profileCard, Shadows.card]}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarBox}>
              {PREVIEW_USER.avatarUrl ? (
                <Image
                  source={{ uri: PREVIEW_USER.avatarUrl }}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={30} color={MeltuneColors.white} />
                </View>
              )}
            </View>

            <View style={styles.profileTextColumn}>
              <View style={styles.tierBadge}>
                <ShieldCheck size={12} color={MeltuneColors.burntOrange} />
                <Text style={styles.tierBadgeText}>{PREVIEW_LOYALTY.tierName}</Text>
              </View>

              <Text style={styles.userName}>{PREVIEW_USER.fullName}</Text>
              <Text style={styles.userEmail}>{PREVIEW_USER.email}</Text>
              <Text style={styles.userPhone}>{PREVIEW_USER.phone}</Text>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <View style={styles.metricIconBox}>
                <Flame size={16} color={MeltuneColors.burntOrange} />
              </View>
              <View>
                <Text style={styles.metricLabel}>DAILY STREAK</Text>
                <Text style={styles.metricValue}>
                  {PREVIEW_LOYALTY.currentStreak} Hari
                </Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View style={styles.metricIconBox}>
                <Sparkles size={16} color={MeltuneColors.burntOrange} />
              </View>
              <View>
                <Text style={styles.metricLabel}>SALDO POIN</Text>
                <Text style={styles.metricValue}>
                  {PREVIEW_LOYALTY.points} Poin
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sIndex) => (
          <View key={sIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={[styles.menuCard, Shadows.subtle]}>
              {section.items.map((item, iIndex) => {
                const Icon = item.icon;
                const isLast = iIndex === section.items.length - 1;

                return (
                  <Pressable
                    key={item.id}
                    onPress={item.onPress}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && styles.menuItemPressed,
                      !isLast && styles.menuItemBorder,
                    ]}
                  >
                    <View style={styles.menuIconBox}>
                      <Icon size={18} color={MeltuneColors.charcoal} />
                    </View>

                    <View style={styles.menuTextColumn}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>

                    <ChevronRight size={16} color={MeltuneColors.textMutedLight} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
        >
          <LogOut size={16} color={MeltuneColors.statusDanger} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </Pressable>

        {/* App Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>MELTUNE AUTO MOBILE // V1.0.0 (EXP 58)</Text>
          <Text style={styles.versionSub}>Workshop Manajemen Otomotif Berstandar APM</Text>
        </View>
      </ScrollView>
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
  },
  profileCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 68,
    height: 68,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    backgroundColor: MeltuneColors.charcoal,
    marginRight: Spacing.md,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MeltuneColors.charcoal,
  },
  profileTextColumn: {
    flex: 1,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  tierBadgeText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  userName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
  },
  userEmail: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 1,
  },
  userPhone: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: 2,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.surfaceLightElevated,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: MeltuneColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  metricLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 0.8,
  },
  metricValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: MeltuneColors.borderLight,
    marginHorizontal: Spacing.sm,
  },
  menuSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 10,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.xs,
  },
  menuCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  menuItemPressed: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: MeltuneColors.borderLight,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuTextColumn: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
  },
  menuSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  logoutButtonPressed: {
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.statusDanger,
  },
  versionInfo: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  versionText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
  },
  versionSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: 2,
  },
});
