import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Car,
  ShoppingBag,
  Sparkles,
  History,
  Clock,
  ChevronRight,
  ShieldCheck,
  Flame,
} from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { VehicleHero } from '@/components/vehicle/VehicleHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  PREVIEW_USER,
  PREVIEW_VEHICLES,
  PREVIEW_BOOKINGS,
  PREVIEW_SERVICES,
  PREVIEW_LOYALTY,
} from '@/services/previewData';
import {
  MeltuneColors,
  Radius,
  Spacing,
  Typography,
  Shadows,
} from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const primaryVehicle = PREVIEW_VEHICLES[0];
  const activeBooking = PREVIEW_BOOKINGS.find(b => b.status === 'in_progress');

  return (
    <AmbientGradientBackground preset="homeAmbient" hasGlowAccent>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 16) + Spacing.sm,
            paddingBottom: 90 + Spacing.xl,
          },
        ]}
      >
        {/* Top Editorial Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.technicalTagRow}>
              <View style={styles.activeDot} />
              <Text style={styles.technicalTag}>MELTUNE AUTO // WORKBAY BSD ONLINE</Text>
            </View>
            <Text style={styles.greetingTitle}>
              Selamat Datang,{'\n'}
              <Text style={styles.greetingName}>{PREVIEW_USER.fullName}</Text>
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.notificationButtonPressed,
            ]}
            accessibilityLabel="Notifications"
          >
            <Bell size={20} color={MeltuneColors.charcoal} />
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>2</Text>
            </View>
          </Pressable>
        </View>

        {/* Featured Vehicle as Centerpiece */}
        {primaryVehicle && (
          <View style={styles.vehicleCenterpieceSection}>
            <VehicleHero
              vehicle={primaryVehicle}
              onPress={() => router.push('/garage')}
              onBookService={() => router.push('/booking')}
              activeBookingStatus={activeBooking ? 'Pengerjaan Servis Aktif' : undefined}
            />
          </View>
        )}

        {/* Active Booking Banner */}
        {activeBooking && (
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={() => router.push('/booking/tracking')}
              style={({ pressed }) => [
                styles.liveTrackingCard,
                Shadows.card,
                pressed && styles.liveTrackingCardPressed,
              ]}
            >
              <View style={styles.liveTrackingHeader}>
                <View style={styles.liveBadgeRow}>
                  <View style={styles.livePulseDot} />
                  <Text style={styles.liveBadgeText}>LIVE SERVICE TRACKING</Text>
                </View>
                <Text style={styles.workbayTag}>{activeBooking.workbayNumber}</Text>
              </View>

              <Text style={styles.liveServiceTitle} numberOfLines={1}>
                {activeBooking.serviceNames[0]}
              </Text>

              <Text style={styles.liveServiceTech}>
                Teknisi: <Text style={styles.techBold}>{activeBooking.assignedMechanic}</Text>
              </Text>

              <View style={styles.liveTrackingFooter}>
                <View style={styles.timeRow}>
                  <Clock size={13} color={MeltuneColors.burntOrange} />
                  <Text style={styles.timeText}>Target Selesai: 12:30 WIB</Text>
                </View>
                <View style={styles.trackingCta}>
                  <Text style={styles.trackingCtaText}>Pantau Workbay</Text>
                  <ChevronRight size={14} color={MeltuneColors.burntOrange} />
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Quick Access Matrix */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            eyebrow="Quick Navigation"
            title="Akses Cepat Pengemudi"
          />

          <View style={styles.quickAccessGrid}>
            <Pressable
              onPress={() => router.push('/garage')}
              style={({ pressed }) => [
                styles.quickAccessCard,
                pressed && styles.quickAccessCardPressed,
              ]}
            >
              <View style={[styles.quickIconBox, { backgroundColor: '#F0ECE3' }]}>
                <Car size={20} color={MeltuneColors.charcoal} />
              </View>
              <Text style={styles.quickTitle}>Garasi Saya</Text>
              <Text style={styles.quickSubtitle}>{PREVIEW_VEHICLES.length} Mobil Terdaftar</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/shop')}
              style={({ pressed }) => [
                styles.quickAccessCard,
                pressed && styles.quickAccessCardPressed,
              ]}
            >
              <View style={[styles.quickIconBox, { backgroundColor: '#F0ECE3' }]}>
                <ShoppingBag size={20} color={MeltuneColors.charcoal} />
              </View>
              <Text style={styles.quickTitle}>Toko Suku Cadang</Text>
              <Text style={styles.quickSubtitle}>Oli & Part OEM</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/loyalty')}
              style={({ pressed }) => [
                styles.quickAccessCard,
                pressed && styles.quickAccessCardPressed,
              ]}
            >
              <View style={[styles.quickIconBox, { backgroundColor: '#FFEDD5' }]}>
                <Flame size={20} color={MeltuneColors.burntOrange} />
              </View>
              <Text style={styles.quickTitle}>Streak & Poin</Text>
              <Text style={styles.quickSubtitle}>{PREVIEW_LOYALTY.currentStreak} Hari Aktif</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/booking/history')}
              style={({ pressed }) => [
                styles.quickAccessCard,
                pressed && styles.quickAccessCardPressed,
              ]}
            >
              <View style={[styles.quickIconBox, { backgroundColor: '#F0ECE3' }]}>
                <History size={20} color={MeltuneColors.charcoal} />
              </View>
              <Text style={styles.quickTitle}>Riwayat Servis</Text>
              <Text style={styles.quickSubtitle}>Rekam Jejak</Text>
            </Pressable>
          </View>
        </View>

        {/* Loyalty Streak Teaser Banner */}
        <View style={styles.sectionContainer}>
          <Pressable
            onPress={() => router.push('/loyalty')}
            style={({ pressed }) => [
              styles.loyaltyCard,
              pressed && styles.loyaltyCardPressed,
            ]}
          >
            <View style={styles.loyaltyLeft}>
              <View style={styles.loyaltyBadge}>
                <Sparkles size={14} color={MeltuneColors.champagne} />
                <Text style={styles.loyaltyBadgeText}>DAILY STREAK WORKSHOP</Text>
              </View>
              <Text style={styles.loyaltyHeading}>
                Kumpulkan Poin untuk Voucher Servis & Part OEM
              </Text>
              <Text style={styles.loyaltySub}>
                Saldo Poin Anda: <Text style={styles.loyaltyPointsBold}>{PREVIEW_LOYALTY.points} Poin</Text>
              </Text>
            </View>

            <View style={styles.streakIndicator}>
              <Flame size={28} color={MeltuneColors.burntOrange} />
              <Text style={styles.streakNumber}>{PREVIEW_LOYALTY.currentStreak}</Text>
              <Text style={styles.streakDays}>HARI</Text>
            </View>
          </Pressable>
        </View>

        {/* Featured Workshop Services */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            eyebrow="Precision Care"
            title="Paket Servis Unggulan"
            subtitle="Pengerjaan presisi dengan peralatan standar APM dan teknisi bersertifikasi"
            actionText="Lihat Semua"
            onActionPress={() => router.push('/booking')}
          />

          <View style={styles.servicesList}>
            {PREVIEW_SERVICES.slice(0, 3).map(service => (
              <Pressable
                key={service.id}
                onPress={() => router.push('/booking')}
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.serviceCardPressed,
                ]}
              >
                <View style={styles.serviceHeaderRow}>
                  <View style={styles.serviceCategoryBadge}>
                    <Text style={styles.serviceCategoryText}>
                      {service.category.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.serviceDurationBadge}>
                    <Clock size={11} color={MeltuneColors.textSecondaryLight} />
                    <Text style={styles.serviceDurationText}>
                      {service.estimatedDurationMinutes} Menit
                    </Text>
                  </View>
                </View>

                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc} numberOfLines={2}>
                  {service.description}
                </Text>

                <View style={styles.serviceFooter}>
                  <Text style={styles.servicePrice}>
                    Rp {service.price.toLocaleString('id-ID')}
                  </Text>
                  <View style={styles.bookSmallButton}>
                    <Text style={styles.bookSmallText}>Pilih Servis</Text>
                    <ChevronRight size={13} color={MeltuneColors.burntOrange} />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Workshop Guarantee Notice */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={22} color={MeltuneColors.burntOrange} />
          <View style={styles.guaranteeTextColumn}>
            <Text style={styles.guaranteeTitle}>Garansi Pengerjaan 30 Hari / 1.000 KM</Text>
            <Text style={styles.guaranteeDesc}>
              Setiap servis di workbay MELTUNE AUTO dilindungi garansi pengerjaan mekanik dan suku cadang asli.
            </Text>
          </View>
        </View>
      </ScrollView>
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.none,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  technicalTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.statusSuccess,
    marginRight: 6,
  },
  technicalTag: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    letterSpacing: 1.2,
  },
  greetingTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    color: MeltuneColors.textSecondaryLight,
  },
  greetingName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title1,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
    letterSpacing: Typography.letterSpacing.editorialHeading,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.subtle,
  },
  notificationButtonPressed: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  unreadBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: MeltuneColors.burntOrange,
    width: 17,
    height: 17,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: MeltuneColors.white,
  },
  unreadCount: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
  },
  vehicleCenterpieceSection: {
    marginBottom: Spacing.lg,
  },
  sectionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  liveTrackingCard: {
    backgroundColor: MeltuneColors.surfaceDark,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 58, 0.4)',
    padding: Spacing.md,
  },
  liveTrackingCardPressed: {
    opacity: 0.96,
  },
  liveTrackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
    marginRight: 6,
  },
  liveBadgeText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.8,
  },
  workbayTag: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.champagne,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  liveServiceTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    marginTop: 2,
  },
  liveServiceTech: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryDark,
    marginTop: 2,
  },
  techBold: {
    color: MeltuneColors.warmIvory,
    fontWeight: Typography.weight.semibold,
  },
  liveTrackingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.champagne,
  },
  trackingCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trackingCtaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickAccessCard: {
    width: '48.5%',
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.subtle,
  },
  quickAccessCardPressed: {
    backgroundColor: MeltuneColors.surfaceLightMuted,
  },
  quickIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  quickTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  quickSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  loyaltyCard: {
    backgroundColor: MeltuneColors.charcoal,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderDark,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loyaltyCardPressed: {
    opacity: 0.95,
  },
  loyaltyLeft: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  loyaltyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  loyaltyBadgeText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.bold,
    letterSpacing: 1,
  },
  loyaltyHeading: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    lineHeight: 20,
  },
  loyaltySub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryDark,
    marginTop: Spacing.xs,
  },
  loyaltyPointsBold: {
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.extrabold,
    fontFamily: Typography.fontFamilyMono,
  },
  streakIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217, 107, 58, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 58, 0.3)',
    borderRadius: Radius.md,
    width: 68,
    height: 76,
  },
  streakNumber: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 20,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.white,
    marginTop: 2,
  },
  streakDays: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.champagne,
    letterSpacing: 1,
  },
  servicesList: {
    gap: Spacing.md,
  },
  serviceCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
    ...Shadows.subtle,
  },
  serviceCardPressed: {
    backgroundColor: MeltuneColors.surfaceLightMuted,
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  serviceCategoryBadge: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  serviceCategoryText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.charcoal,
    fontWeight: Typography.weight.bold,
  },
  serviceDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  serviceDurationText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
  },
  serviceName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  serviceDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
  },
  servicePrice: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  bookSmallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bookSmallText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.white,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  guaranteeTextColumn: {
    flex: 1,
  },
  guaranteeTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  guaranteeDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
});
