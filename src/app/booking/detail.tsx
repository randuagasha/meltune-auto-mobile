import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  Car,
  FileText,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PREVIEW_BOOKINGS } from '@/services/previewData';
import { useBookingsQuery } from '@/hooks/useWorkshopData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function BookingDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { data: bookings = PREVIEW_BOOKINGS } = useBookingsQuery();

  const bookingId = String(params.id || '');
  const booking =
    bookings.find(b => b.id === bookingId) ||
    PREVIEW_BOOKINGS.find(b => b.id === bookingId) ||
    bookings[0];

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Detail Reservasi"
        subtitle={`Nomor Referensi: ${booking.bookingReference}`}
        tag="WORKBAY SPECIFICATION"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
      >
        {/* Status Header Card */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.topStatusRow}>
            <View style={styles.refBox}>
              <Text style={styles.refLabel}>KODE BOOKING</Text>
              <Text style={styles.refCode}>{booking.bookingReference}</Text>
            </View>
            <StatusBadge status={booking.status} />
          </View>

          <View style={styles.timeScheduleBox}>
            <View style={styles.timeScheduleItem}>
              <Calendar size={15} color={MeltuneColors.burntOrange} />
              <Text style={styles.timeScheduleText}>{booking.scheduledDate}</Text>
            </View>
            <View style={styles.timeScheduleItem}>
              <Clock size={15} color={MeltuneColors.burntOrange} />
              <Text style={styles.timeScheduleText}>{booking.scheduledTimeSlot} WIB</Text>
            </View>
          </View>

          {booking.status === 'in_progress' && (
            <Pressable
              onPress={() => router.push('/booking/tracking')}
              style={({ pressed }) => [
                styles.liveBanner,
                pressed && styles.liveBannerPressed,
              ]}
            >
              <View style={styles.liveBannerLeft}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBannerText}>Mobil Sedang Dalam Pengerjaan</Text>
              </View>
              <View style={styles.liveBannerRight}>
                <Text style={styles.liveBannerCta}>Buka Live Workbay</Text>
                <ChevronRight size={14} color={MeltuneColors.burntOrange} />
              </View>
            </Pressable>
          )}
        </View>

        {/* Vehicle Information */}
        <View style={[styles.card, Shadows.card]}>
          <Text style={styles.sectionHeading}>DATA KENDARAAN</Text>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleIconBox}>
              <Car size={24} color={MeltuneColors.burntOrange} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{booking.vehicleName}</Text>
              <View style={styles.plateTag}>
                <Text style={styles.plateText}>{booking.licensePlate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Selected Services & Breakdown */}
        <View style={[styles.card, Shadows.card]}>
          <Text style={styles.sectionHeading}>RINCIAN PAKET SERVIS</Text>
          <View style={styles.servicesList}>
            {booking.serviceNames.map((name, index) => (
              <View key={index} style={styles.serviceItemRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.serviceItemName}>{name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Estimasi Biaya Servis:</Text>
            <Text style={styles.totalValue}>
              Rp {booking.totalPrice.toLocaleString('id-ID')}
            </Text>
          </View>
          <Text style={styles.totalNote}>
            *Biaya akhir disesuaikan dengan volume oli dan penambahan sparepart yang disetujui pelanggan.
          </Text>
        </View>

        {/* Problem Description & Customer Notes */}
        {booking.problemDescription && (
          <View style={[styles.card, Shadows.card]}>
            <Text style={styles.sectionHeading}>KELUHAN PELANGGAN</Text>
            <Text style={styles.problemText}>"{booking.problemDescription}"</Text>
          </View>
        )}

        {/* Mechanic Notes */}
        {booking.mechanicNotes && (
          <View style={[styles.notesCard, Shadows.card]}>
            <View style={styles.notesHeader}>
              <Wrench size={16} color={MeltuneColors.burntOrange} />
              <Text style={styles.notesTitle}>
                CATATAN KEPALA MEKANIK ({booking.assignedMechanic || 'Master Tech'})
              </Text>
            </View>
            <Text style={styles.notesBody}>{booking.mechanicNotes}</Text>
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.lg,
  },
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  refBox: {
    gap: 2,
  },
  refLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
  },
  refCode: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
  },
  timeScheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.surfaceLightElevated,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: Spacing.lg,
  },
  timeScheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeScheduleText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
    fontWeight: Typography.weight.semibold,
  },
  liveBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.md,
  },
  liveBannerPressed: {
    backgroundColor: '#FFEDD5',
  },
  liveBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
  },
  liveBannerText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  liveBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  liveBannerCta: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  sectionHeading: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  vehicleIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  plateTag: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
    marginTop: 4,
  },
  plateText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  servicesList: {
    gap: Spacing.xs,
  },
  serviceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
  },
  serviceItemName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: MeltuneColors.borderLight,
    marginVertical: Spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
  },
  totalValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  totalNote: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  problemText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  notesCard: {
    backgroundColor: '#FBFBFA',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E4E1D9',
    borderLeftWidth: 4,
    borderLeftColor: MeltuneColors.burntOrange,
    padding: Spacing.lg,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  notesTitle: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    letterSpacing: 0.8,
  },
  notesBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
    lineHeight: 18,
  },
});
