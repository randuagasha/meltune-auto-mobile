import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  User,
  LogOut,
  Car,
  Calendar,
  ShoppingBag,
  Sparkles,
  Settings,
  HelpCircle,
} from 'lucide-react-native';
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { EditorialSection } from '@/components/ui/EditorialSection';
import { DividedList } from '@/components/ui/DividedList';
import { TechnicalListRow } from '@/components/ui/TechnicalListRow';
import { PREVIEW_USER, PREVIEW_LOYALTY } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun Meltune Auto?',
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

  const workshopItems = [
    {
      id: 'garage',
      title: 'Garasi Kendaraan',
      subtitle: 'Spesifikasi mesin dan rekomendasi oli APM',
      icon: <Car size={18} color={MeltuneColors.charcoal} />,
      onPress: () => router.push('/garage'),
    },
    {
      id: 'booking_history',
      title: 'Riwayat Reservasi Servis',
      subtitle: 'Catatan servis berkala dan log mekanik',
      icon: <Calendar size={18} color={MeltuneColors.charcoal} />,
      onPress: () => router.push('/booking/history'),
    },
    {
      id: 'orders',
      title: 'Pesanan Suku Cadang',
      subtitle: 'Status pengiriman dan pengambilan toko',
      icon: <ShoppingBag size={18} color={MeltuneColors.charcoal} />,
      onPress: () => router.push('/shop/orders'),
    },
  ];

  const rewardItems = [
    {
      id: 'loyalty',
      title: 'Daily Streak & Poin Reward',
      subtitle: `${PREVIEW_LOYALTY.points.toLocaleString('id-ID')} Poin • ${PREVIEW_LOYALTY.currentStreak} Hari Beruntun`,
      icon: <Sparkles size={18} color={MeltuneColors.burntOrange} />,
      badge: `${PREVIEW_LOYALTY.currentStreak} HARI`,
      badgeVariant: 'accent' as const,
      onPress: () => router.push('/loyalty'),
    },
  ];

  const accountItems = [
    {
      id: 'edit_profile',
      title: 'Informasi Akun',
      subtitle: 'Ubah nama, nomor telepon, dan preferensi',
      icon: <Settings size={18} color={MeltuneColors.charcoal} />,
      onPress: () => router.push('/profile/edit'),
    },
    {
      id: 'support',
      title: 'Pusat Bantuan & Konsultasi',
      subtitle: 'Konsultasi teknis dengan service advisor workshop',
      icon: <HelpCircle size={18} color={MeltuneColors.charcoal} />,
      onPress: () => router.push('/support'),
    },
  ];

  return (
    <AmbientGradientShell
      tag="CUSTOMER ID // 01"
      title="Akun & Profil"
      subtitle="Identitas pemilik dan preferensi aplikasi"
    >
      {/* 1. Driver Identity Block (Directly on the Surface) */}
      <View style={styles.identitySection}>
        <View style={styles.identityRow}>
          <View style={styles.avatarBox}>
            {PREVIEW_USER.avatarUrl ? (
              <Image
                source={{ uri: PREVIEW_USER.avatarUrl }}
                style={styles.avatarImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={26} color={MeltuneColors.white} />
              </View>
            )}
          </View>

          <View style={styles.identityDetails}>
            <View style={styles.tierPill}>
              <Text style={styles.tierText}>{PREVIEW_LOYALTY.tierName}</Text>
            </View>
            <Text style={styles.userName}>{PREVIEW_USER.fullName}</Text>
            <Text style={styles.userEmail}>{PREVIEW_USER.email}</Text>
            <Text style={styles.userPhone}>{PREVIEW_USER.phone}</Text>
          </View>
        </View>

        {/* Minimal Metric Bar */}
        <View style={styles.metricRow}>
          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>Daily Streak</Text>
            <Text style={styles.metricValue}>{PREVIEW_LOYALTY.currentStreak} Hari</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>Saldo Poin</Text>
            <Text style={styles.metricValue}>
              {PREVIEW_LOYALTY.points.toLocaleString('id-ID')} Poin
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Workshop Activity */}
      <EditorialSection
        title="Aktivitas Workshop"
        subtitle="Akses cepat ke garasi mobil dan log pengerjaan"
      >
        <DividedList
          data={workshopItems}
          keyExtractor={item => item.id}
          withOuterBorders
          renderItem={item => (
            <TechnicalListRow
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onPress={item.onPress}
            />
          )}
        />
      </EditorialSection>

      {/* 3. Membership Rewards */}
      <EditorialSection
        title="Keanggotaan & Hadiah"
      >
        <DividedList
          data={rewardItems}
          keyExtractor={item => item.id}
          withOuterBorders
          renderItem={item => (
            <TechnicalListRow
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              badge={item.badge}
              badgeVariant={item.badgeVariant}
              onPress={item.onPress}
            />
          )}
        />
      </EditorialSection>

      {/* 4. Account Settings & Support */}
      <EditorialSection
        title="Pengaturan & Bantuan"
      >
        <DividedList
          data={accountItems}
          keyExtractor={item => item.id}
          withOuterBorders
          renderItem={item => (
            <TechnicalListRow
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onPress={item.onPress}
            />
          )}
        />
      </EditorialSection>

      {/* 5. Clean Logout Action */}
      <View style={styles.logoutWrapper}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Keluar dari akun"
        >
          <LogOut size={16} color={MeltuneColors.statusDanger} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </Pressable>
      </View>

      {/* Minimal Colophon */}
      <View style={styles.colophon}>
        <Text style={styles.colophonText}>Meltune Auto Mobile • Versi 1.0.0</Text>
      </View>
    </AmbientGradientShell>
  );
}

const styles = StyleSheet.create({
  identitySection: {
    paddingHorizontal: Spacing.xl, // 24px consistent horizontal padding
    marginBottom: Spacing.xxxl,    // 40px major visual separation
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: MeltuneColors.charcoal,
    marginRight: Spacing.lg,
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
  identityDetails: {
    flex: 1,
  },
  tierPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 107, 58, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    marginBottom: 4,
  },
  tierText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
  userName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  userPhone: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.08)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  metricCell: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(36, 37, 34, 0.08)',
  },
  logoutWrapper: {
    paddingHorizontal: Spacing.xl, // 24px
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.18)',
    minHeight: 48,
  },
  logoutButtonPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  logoutText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.statusDanger,
  },
  colophon: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  colophonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
  },
});
