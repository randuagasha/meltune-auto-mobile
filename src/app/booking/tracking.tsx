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
import { Wrench, Phone, ShieldCheck, MapPin } from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { BookingTimeline } from '@/components/booking/BookingTimeline';
import { PREVIEW_BOOKINGS } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function ServiceTrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeBooking =
    PREVIEW_BOOKINGS.find(b => b.status === 'in_progress') || PREVIEW_BOOKINGS[0];

  return (
    <AmbientGradientBackground preset="cockpitDark">
      <AppHeader
        title="Live Workbay Tracking"
        subtitle={`Mobil: ${activeBooking.vehicleName}`}
        tag="REAL-TIME TELEMETRY // BSD"
        dark
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
      >
        {/* Workbay Status Banner */}
        <View style={[styles.statusBanner, Shadows.darkElevated]}>
          <View style={styles.statusTopRow}>
            <View style={styles.pulseBox}>
              <View style={styles.pulseInner} />
              <Text style={styles.pulseText}>WORKBAY LIVE STATUS</Text>
            </View>
            <View style={styles.bayTag}>
              <Text style={styles.bayTagText}>{activeBooking.workbayNumber}</Text>
            </View>
          </View>

          <Text style={styles.serviceHeadline}>
            {activeBooking.serviceNames[0]}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>KENDARAAN</Text>
              <Text style={styles.metaValue}>{activeBooking.licensePlate}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>KEPALA TEKNISI</Text>
              <Text style={styles.metaValue}>
                {activeBooking.assignedMechanic || 'Master Tech'}
              </Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>ESTIMASI SELESAI</Text>
              <Text style={[styles.metaValue, { color: MeltuneColors.burntOrange }]}>
                12:30 WIB
              </Text>
            </View>
          </View>
        </View>

        {/* Detailed Timeline Component */}
        {activeBooking.stages && (
          <View style={styles.timelineSection}>
            <Text style={styles.timelineSectionTitle}>
              Tahapan Pekerjaan Mekanik di Workbay
            </Text>
            <BookingTimeline
              stages={activeBooking.stages}
              workbayNumber={activeBooking.workbayNumber}
              assignedMechanic={activeBooking.assignedMechanic}
            />
          </View>
        )}

        {/* Workshop Location & Contact */}
        <View style={styles.workshopCard}>
          <View style={styles.workshopHeader}>
            <MapPin size={18} color={MeltuneColors.burntOrange} />
            <Text style={styles.workshopTitle}>MELTUNE AUTO BSD WORKSHOP</Text>
          </View>
          <Text style={styles.workshopAddress}>
            Kawasan Otomotif BSD Blok B No. 12, Tangerang Selatan
          </Text>

          <Pressable
            onPress={() => router.push('/support')}
            style={({ pressed }) => [
              styles.advisorButton,
              pressed && styles.advisorButtonPressed,
            ]}
          >
            <Phone size={14} color={MeltuneColors.charcoal} />
            <Text style={styles.advisorButtonText}>
              Hubungi Service Advisor Workshop
            </Text>
          </Pressable>
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
  statusBanner: {
    backgroundColor: MeltuneColors.surfaceDark,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 58, 0.45)',
    padding: Spacing.lg,
  },
  statusTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  pulseBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseInner: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
  },
  pulseText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.8,
  },
  bayTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  bayTagText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.bold,
  },
  serviceHeadline: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    marginTop: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  metaCol: {
    gap: 2,
  },
  metaLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.textMutedDark,
    letterSpacing: 0.8,
  },
  metaValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.warmIvory,
  },
  timelineSection: {
    gap: Spacing.sm,
  },
  timelineSectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.warmIvory,
    paddingLeft: Spacing.xs,
  },
  workshopCard: {
    backgroundColor: 'rgba(36, 37, 34, 0.85)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.md,
  },
  workshopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  workshopTitle: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.champagne,
    letterSpacing: 0.5,
  },
  workshopAddress: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryDark,
    lineHeight: 18,
  },
  advisorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: MeltuneColors.white,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    marginTop: Spacing.md,
  },
  advisorButtonPressed: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  advisorButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
});
