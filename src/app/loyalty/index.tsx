import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Sparkles, Gift, Check, ShieldCheck } from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PREVIEW_LOYALTY, PREVIEW_REWARDS } from '@/services/previewData';
import {
  useLoyaltyProfileQuery,
  useLoyaltyRewardsQuery,
  useDailyCheckInMutation,
  useRedeemRewardMutation,
} from '@/hooks/useWorkshopData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function LoyaltyScreen() {
  const insets = useSafeAreaInsets();

  const { data: loyalty = PREVIEW_LOYALTY, refetch } = useLoyaltyProfileQuery();
  const { data: rewards = PREVIEW_REWARDS } = useLoyaltyRewardsQuery();
  const checkInMutation = useDailyCheckInMutation();
  const redeemMutation = useRedeemRewardMutation();
  const [checkingIn, setCheckingIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await checkInMutation.mutateAsync();
      Alert.alert(
        res.success ? 'Streak Berhasil!' : 'Info Check-In',
        res.message || 'Streak harian berhasil dicatat.'
      );
    } catch (err: any) {
      Alert.alert('Gagal Check-In', err?.message || 'Terjadi kesalahan.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleRedeem = (reward: any) => {
    if (loyalty.points < reward.pointsCost) {
      Alert.alert('Poin Tidak Cukup', 'Saldo poin Anda belum mencukupi untuk reward ini.');
      return;
    }

    Alert.alert(
      'Konfirmasi Penukaran',
      `Tukar ${reward.pointsCost} Poin untuk "${reward.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tukar Sekarang',
          onPress: async () => {
            try {
              const res = await redeemMutation.mutateAsync(reward.id);
              Alert.alert(
                'Penukaran Berhasil!',
                `Kode Voucher Anda: ${res.code || 'MLT-' + Math.random().toString(36).substring(2, 8).toUpperCase()}\nTunjukkan kode ini saat kedatangan di workshop.`
              );
            } catch (err: any) {
              Alert.alert('Gagal Menukar Reward', err?.message || 'Terjadi kesalahan.');
            }
          },
        },
      ]
    );
  };

  return (
    <AmbientGradientBackground preset="homeAmbient">
      <AppHeader
        title="Loyalitas & Streak"
        subtitle="Program Apresiasi Perawatan Berkala"
        tag="MELTUNE CLUB PRECISION"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MeltuneColors.burntOrange}
          />
        }
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
      >
        {/* Streak & Balance Hero */}
        <View style={[styles.heroCard, Shadows.card]}>
          <View style={styles.heroRow}>
            <View style={styles.heroCol}>
              <View style={styles.badgeRow}>
                <Flame size={18} color={MeltuneColors.burntOrange} />
                <Text style={styles.badgeLabel}>DAILY STREAK</Text>
              </View>
              <Text style={styles.streakValue}>{loyalty.currentStreak} Hari</Text>
              <Text style={styles.streakDesc}>Rekor: {loyalty.longestStreak} Hari</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroCol}>
              <View style={styles.badgeRow}>
                <Sparkles size={18} color={MeltuneColors.burntOrange} />
                <Text style={styles.badgeLabel}>SALDO POIN</Text>
              </View>
              <Text style={styles.pointsValue}>{loyalty.points}</Text>
              <Text style={styles.pointsDesc}>Tersedia ditukar</Text>
            </View>
          </View>

          {/* Daily Check-in Button */}
          <PrimaryButton
            title="Lakukan Check-In Hari Ini (+25 Poin)"
            onPress={handleCheckIn}
            loading={checkingIn}
            style={styles.checkInButton}
            icon={<Flame size={16} color={MeltuneColors.white} />}
          />
        </View>

        {/* Member Tier Card */}
        <View style={styles.tierCard}>
          <ShieldCheck size={20} color={MeltuneColors.burntOrange} />
          <View style={styles.tierInfo}>
            <Text style={styles.tierTitle}>Tingkat Member: {loyalty.tierName}</Text>
            <Text style={styles.tierSub}>
              Dapatkan diskon 10% untuk seluruh chemical detailing dan prioritas antrean servis utama.
            </Text>
          </View>
        </View>

        {/* Rewards Catalog */}
        <View style={styles.catalogSection}>
          <Text style={styles.sectionHeading}>KATALOG VOUCHER & REWARD SUKU CADANG</Text>
          <Text style={styles.sectionSub}>
            Poin dipotong langsung dari saldo dan menghasilkan voucher unik workshop.
          </Text>

          <View style={styles.rewardsList}>
            {rewards.map(reward => {
              const canAfford = loyalty.points >= reward.pointsCost;
              return (
                <View key={reward.id} style={[styles.rewardCard, Shadows.subtle]}>
                  <Image
                    source={{ uri: reward.imageUrl }}
                    style={styles.rewardImage}
                    contentFit="cover"
                  />
                  <View style={styles.rewardBody}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardDesc} numberOfLines={2}>
                      {reward.description}
                    </Text>

                    <View style={styles.rewardFooter}>
                      <View style={styles.costBox}>
                        <Sparkles size={13} color={MeltuneColors.burntOrange} />
                        <Text style={styles.costText}>{reward.pointsCost} Poin</Text>
                      </View>

                      <Pressable
                        onPress={() => handleRedeem(reward)}
                        style={[
                          styles.redeemButton,
                          !canAfford && styles.redeemButtonDisabled,
                        ]}
                      >
                        <Text style={styles.redeemText}>Tukar Voucher</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  heroCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroCol: {
    flex: 1,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  badgeLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    letterSpacing: 1,
  },
  streakValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.title1,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
  },
  streakDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: 2,
  },
  pointsValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.title1,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  pointsDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 48,
    backgroundColor: MeltuneColors.borderLight,
  },
  checkInButton: {
    width: '100%',
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  tierInfo: {
    flex: 1,
  },
  tierTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  tierSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
    lineHeight: 16,
  },
  catalogSection: {
    gap: Spacing.xs,
  },
  sectionHeading: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
  },
  sectionSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginBottom: Spacing.sm,
  },
  rewardsList: {
    gap: Spacing.md,
  },
  rewardCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    overflow: 'hidden',
  },
  rewardImage: {
    width: '100%',
    height: 120,
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  rewardBody: {
    padding: Spacing.md,
  },
  rewardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  rewardDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 4,
    lineHeight: 16,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
  },
  costBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  redeemButton: {
    backgroundColor: MeltuneColors.charcoal,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  redeemButtonDisabled: {
    opacity: 0.4,
  },
  redeemText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
  },
});
