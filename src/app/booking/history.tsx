import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, ChevronRight, Clock } from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PREVIEW_BOOKINGS } from '@/services/previewData';
import { useBookingsQuery } from '@/hooks/useWorkshopData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function BookingHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: bookings = PREVIEW_BOOKINGS, refetch } = useBookingsQuery();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'active'>('all');

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'completed') return b.status === 'completed';
    if (activeFilter === 'active')
      return (
        b.status === 'in_progress' ||
        b.status === 'pending' ||
        b.status === 'confirmed' ||
        b.status === 'waiting_for_parts'
      );
    return true;
  });

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Riwayat Servis"
        subtitle="Log Pemeliharaan & Rekam Jejak Servis"
        tag="MAINTENANCE ARCHIVE"
        showBack
      />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {[
          { id: 'all', label: 'Semua Log' },
          { id: 'active', label: 'Aktif / Berjalan' },
          { id: 'completed', label: 'Selesai' },
        ].map(tab => {
          const isSelected = activeFilter === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveFilter(tab.id as any)}
              style={[
                styles.filterTab,
                isSelected && styles.filterTabSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isSelected && styles.filterTabTextSelected,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

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
        <View style={styles.bookingList}>
          {filteredBookings.map(booking => (
            <Pressable
              key={booking.id}
              onPress={() =>
                router.push({
                  pathname: '/booking/detail',
                  params: { id: booking.id },
                })
              }
              style={({ pressed }) => [
                styles.bookingCard,
                Shadows.subtle,
                pressed && styles.bookingCardPressed,
              ]}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.refText}>{booking.bookingReference}</Text>
                  <Text style={styles.dateText}>
                    {booking.scheduledDate} • {booking.scheduledTimeSlot} WIB
                  </Text>
                </View>
                <StatusBadge status={booking.status} />
              </View>

              <Text style={styles.vehicleText}>
                {booking.vehicleName} ({booking.licensePlate})
              </Text>

              <View style={styles.servicesBox}>
                {booking.serviceNames.map((name, i) => (
                  <Text key={i} style={styles.serviceNameItem}>
                    • {name}
                  </Text>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.priceText}>
                  Rp {booking.totalPrice.toLocaleString('id-ID')}
                </Text>
                <View style={styles.detailCta}>
                  <Text style={styles.detailCtaText}>Buka Detail</Text>
                  <ChevronRight size={14} color={MeltuneColors.burntOrange} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterTab: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
  filterTabSelected: {
    backgroundColor: MeltuneColors.charcoal,
    borderColor: MeltuneColors.charcoal,
  },
  filterTabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
  },
  filterTabTextSelected: {
    color: MeltuneColors.white,
    fontWeight: Typography.weight.bold,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  bookingList: {
    gap: Spacing.md,
  },
  bookingCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
  },
  bookingCardPressed: {
    backgroundColor: MeltuneColors.surfaceLightMuted,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  refText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  dateText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  vehicleText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: Spacing.xs,
  },
  servicesBox: {
    marginTop: Spacing.xs,
    gap: 2,
  },
  serviceNameItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
  },
  priceText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  detailCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailCtaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
});
