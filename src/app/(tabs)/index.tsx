import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  Clock,
  ChevronRight,
  Car,
  ShoppingBag,
  Sparkles,
  History,
  Wrench,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { DividedList } from '@/components/ui/DividedList';
import { TechnicalListRow } from '@/components/ui/TechnicalListRow';
import { PREVIEW_USER, PREVIEW_VEHICLES, PREVIEW_BOOKINGS, PREVIEW_SERVICES } from '@/services/previewData';
import { useAuthStore } from '@/stores/authStore';
import {
  useVehiclesQuery,
  useBookingsQuery,
  useServicesQuery,
  useLoyaltyProfileQuery,
} from '@/hooks/useWorkshopData';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: vehicles = [], refetch: refetchVehicles } = useVehiclesQuery();
  const { data: bookings = [], refetch: refetchBookings } = useBookingsQuery();
  const { data: services = [], refetch: refetchServices } = useServicesQuery();
  const { data: loyalty, refetch: refetchLoyalty } = useLoyaltyProfileQuery();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchVehicles(),
      refetchBookings(),
      refetchServices(),
      refetchLoyalty(),
    ]);
    setRefreshing(false);
  };

  const primaryVehicle = vehicles[0] || PREVIEW_VEHICLES[0];
  const activeBooking = bookings.find(b => b.status === 'in_progress' || b.status === 'confirmed');

  // Custom Header rendered on top of the Persistent Gradient Background
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <Text style={styles.brandTag}>MELTUNE AUTO</Text>
        <Text style={styles.greetingTitle}>
          Selamat datang, <Text style={styles.userName}>{user?.fullName || PREVIEW_USER.fullName}</Text>
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/notifications')}
        style={({ pressed }) => [
          styles.notificationButton,
          pressed && styles.notificationButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Notifikasi"
        hitSlop={10}
      >
        <Bell size={20} color={MeltuneColors.white} />
        <View style={styles.unreadDot} />
      </Pressable>
    </View>
  );

  return (
    <AmbientGradientShell
      customHeader={renderHeader()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={MeltuneColors.burntOrange}
        />
      }
    >
      {/* 1. Primary Vehicle Showcase (Directly on the Surface) */}
      {primaryVehicle && (
        <View style={styles.vehicleShowcaseSection}>
          <View style={styles.vehicleHeaderRow}>
            <View>
              <Text style={styles.vehicleModelName}>{primaryVehicle.model}</Text>
              <Text style={styles.vehiclePlateSub}>
                {primaryVehicle.licensePlate} • Tahun {primaryVehicle.year} • {primaryVehicle.mileage?.toLocaleString('id-ID')} km
              </Text>
            </View>

            <Pressable
              onPress={() => router.push('/garage')}
              style={styles.garageLink}
              hitSlop={8}
            >
              <Text style={styles.garageLinkText}>Garasi</Text>
              <ChevronRight size={13} color={MeltuneColors.burntOrange} />
            </Pressable>
          </View>

          {/* Vehicle Photography Area */}
          <Pressable
            onPress={() => router.push('/garage')}
            style={({ pressed }) => [
              styles.vehicleImageWrapper,
              pressed && styles.vehicleImageWrapperPressed,
            ]}
          >
            {primaryVehicle.imageUrl ? (
              <Image
                source={{ uri: primaryVehicle.imageUrl }}
                style={styles.vehicleImage}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <View style={styles.vehicleImagePlaceholder}>
                <Car size={36} color={MeltuneColors.textMutedLight} />
              </View>
            )}
          </Pressable>

          {/* Direct Service Booking Action */}
          <Pressable
            onPress={() => router.push('/booking')}
            style={({ pressed }) => [
              styles.primaryBookButton,
              pressed && styles.primaryBookButtonPressed,
            ]}
          >
            <Wrench size={16} color={MeltuneColors.white} />
            <Text style={styles.primaryBookButtonText}>Reservasi Servis Mobil Ini</Text>
          </Pressable>
        </View>
      )}

      {/* 2. Active Service Status Banner (When In Progress) */}
      {activeBooking && (
        <View style={styles.sectionSpacing}>
          <Pressable
            onPress={() => router.push('/booking/tracking')}
            style={({ pressed }) => [
              styles.activeBanner,
              pressed && styles.activeBannerPressed,
            ]}
          >
            <View style={styles.activeBannerTop}>
              <View style={styles.activeTag}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeTagText}>Pengerjaan Servis Aktif</Text>
              </View>
              <Text style={styles.workbayTagText}>{activeBooking.workbayNumber}</Text>
            </View>

            <Text style={styles.activeServiceTitle}>{activeBooking.serviceNames[0]}</Text>

            <View style={styles.activeBannerFooter}>
              <View style={styles.activeTimeRow}>
                <Clock size={13} color={MeltuneColors.burntOrange} />
                <Text style={styles.activeTimeText}>Target Selesai: 12:30 WIB</Text>
              </View>

              <View style={styles.activeActionRow}>
                <Text style={styles.activeActionText}>Pantau Status</Text>
                <ChevronRight size={13} color={MeltuneColors.burntOrange} />
              </View>
            </View>
          </Pressable>
        </View>
      )}

      {/* 3. Quick Actions Row (Icon & Label Actions) */}
      <View style={styles.sectionSpacing}>
        <Text style={styles.sectionHeading}>Menu Akses Cepat</Text>
        <View style={styles.quickActionsRow}>
          <Pressable
            onPress={() => router.push('/garage')}
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
          >
            <View style={styles.actionIconCircle}>
              <Car size={20} color={MeltuneColors.charcoal} strokeWidth={1.9} />
            </View>
            <Text style={styles.actionLabel}>Garasi</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/shop')}
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
          >
            <View style={styles.actionIconCircle}>
              <ShoppingBag size={20} color={MeltuneColors.charcoal} strokeWidth={1.9} />
            </View>
            <Text style={styles.actionLabel}>Suku Cadang</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/loyalty')}
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
          >
            <View style={styles.actionIconCircle}>
              <Sparkles size={20} color={MeltuneColors.charcoal} strokeWidth={1.9} />
            </View>
            <Text style={styles.actionLabel}>Poin & Streak</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/booking/history')}
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
          >
            <View style={styles.actionIconCircle}>
              <History size={20} color={MeltuneColors.charcoal} strokeWidth={1.9} />
            </View>
            <Text style={styles.actionLabel}>Riwayat</Text>
          </Pressable>
        </View>
      </View>

      {/* 4. Precision Care: Featured Workshop Services */}
      <View style={styles.servicesSection}>
        <View style={styles.servicesHeaderRow}>
          <View>
            <Text style={styles.sectionHeading}>Paket Servis Berkala</Text>
            <Text style={styles.sectionSubHeading}>
              Dikerjakan oleh teknisi bersertifikasi APM
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/booking')}
            style={styles.viewAllButton}
            hitSlop={8}
          >
            <Text style={styles.viewAllText}>Semua</Text>
            <ChevronRight size={13} color={MeltuneColors.burntOrange} />
          </Pressable>
        </View>

        <DividedList
          data={PREVIEW_SERVICES.slice(0, 3)}
          keyExtractor={item => item.id}
          withOuterBorders
          renderItem={service => (
            <TechnicalListRow
              key={service.id}
              title={service.name}
              subtitle={service.description}
              value={`Rp ${service.price.toLocaleString('id-ID')}`}
              valueSub={`${service.estimatedDurationMinutes} menit`}
              onPress={() => router.push('/booking')}
            />
          )}
        />
      </View>
    </AmbientGradientShell>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  headerLeft: {
    flex: 1,
  },
  brandTag: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.champagne,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  greetingTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 22,
    fontWeight: Typography.weight.regular,
    color: 'rgba(255, 255, 255, 0.92)',
    letterSpacing: -0.3,
  },
  userName: {
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: Spacing.md,
  },
  notificationButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
    borderWidth: 1.5,
    borderColor: MeltuneColors.white,
  },
  vehicleShowcaseSection: {
    paddingHorizontal: Spacing.xl, // 24px consistent horizontal padding
    marginBottom: Spacing.xxxl,    // 40px major visual separation
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  vehicleModelName: {
    fontFamily: Typography.fontFamily,
    fontSize: 22,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    letterSpacing: -0.4,
  },
  vehiclePlateSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  garageLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingTop: 4,
  },
  garageLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
  vehicleImageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: MeltuneColors.surfaceLightElevated,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.08)',
    marginBottom: Spacing.md,
  },
  vehicleImageWrapperPressed: {
    opacity: 0.95,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  primaryBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MeltuneColors.burntOrange,
    borderRadius: Radius.xs,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    minHeight: 48,
  },
  primaryBookButtonPressed: {
    backgroundColor: MeltuneColors.orangePressed,
  },
  primaryBookButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    letterSpacing: 0.3,
  },
  sectionSpacing: {
    paddingHorizontal: Spacing.xl, // 24px
    marginBottom: Spacing.xxxl,    // 40px major visual separation
  },
  activeBanner: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 58, 0.3)',
    padding: Spacing.lg,
  },
  activeBannerPressed: {
    opacity: 0.96,
  },
  activeBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
  },
  activeTagText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
  workbayTagText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
  },
  activeServiceTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  activeBannerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(36, 37, 34, 0.08)',
  },
  activeTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeTimeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
    fontWeight: Typography.weight.medium,
  },
  activeActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  activeActionText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  sectionHeading: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    letterSpacing: -0.2,
  },
  sectionSubHeading: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  actionItemPressed: {
    opacity: 0.75,
  },
  actionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
    textAlign: 'center',
  },
  servicesSection: {
    marginBottom: Spacing.xxxl,
  },
  servicesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingBottom: 2,
  },
  viewAllText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
});
