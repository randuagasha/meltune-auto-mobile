import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Wrench,
  Gauge,
  Calendar,
  Fuel,
  Settings,
  Shield,
  Edit,
} from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PREVIEW_VEHICLES } from '@/services/previewData';
import { useVehiclesQuery } from '@/hooks/useWorkshopData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function VehicleDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { data: vehicles = PREVIEW_VEHICLES } = useVehiclesQuery();

  const vehicleId = String(params.id || '');
  const vehicle =
    vehicles.find(v => v.id === vehicleId) ||
    PREVIEW_VEHICLES.find(v => v.id === vehicleId) ||
    vehicles[0];

  const specs = [
    { label: 'MEREK & TAHUN', value: `${vehicle.brand} (${vehicle.year})` },
    { label: 'PLAT NOMOR', value: vehicle.licensePlate },
    { label: 'KODE MESIN', value: vehicle.engineCode || '2.0L Turbo' },
    { label: 'TRANSMISI', value: vehicle.transmission.toUpperCase() },
    { label: 'BAHAN BAKAR', value: vehicle.fuelType.toUpperCase() },
    { label: 'NOMOR SASIS (VIN)', value: vehicle.vin || 'WBA5R11030FM98214' },
    { label: 'WARNA EKSTERIOR', value: vehicle.color || 'Alpine White' },
    {
      label: 'ODOMETER TERCATAT',
      value: vehicle.mileage ? `${vehicle.mileage.toLocaleString('id-ID')} KM` : '-',
    },
  ];

  return (
    <AmbientGradientBackground preset="cockpitDark">
      <AppHeader
        title={vehicle.model}
        subtitle={`Nomor Plat: ${vehicle.licensePlate}`}
        tag="SPECIFICATION SHEET"
        dark
        showBack
        rightAction={
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/vehicle/edit',
                params: { id: vehicle.id },
              })
            }
            style={styles.editButton}
            accessibilityLabel="Edit vehicle"
          >
            <Edit size={18} color={MeltuneColors.white} />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
      >
        {/* Vehicle Image */}
        <View style={[styles.imageContainer, Shadows.darkElevated]}>
          {vehicle.imageUrl ? (
            <Image
              source={{ uri: vehicle.imageUrl }}
              style={styles.vehicleImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
          <View style={styles.plateOverlay}>
            <Text style={styles.plateOverlayText}>{vehicle.licensePlate}</Text>
          </View>
        </View>

        {/* Action Button: Book Service for This Vehicle */}
        <PrimaryButton
          title="Reservasi Servis untuk Mobil Ini"
          onPress={() => router.push('/booking')}
          icon={<Wrench size={16} color={MeltuneColors.white} />}
          size="lg"
          style={styles.bookCta}
        />

        {/* Technical Spec Matrix */}
        <View style={[styles.specCard, Shadows.darkElevated]}>
          <Text style={styles.specCardTitle}>SPESIFIKASI TEKNIS WORKSHOP</Text>

          <View style={styles.specGrid}>
            {specs.map((item, idx) => (
              <View key={idx} style={styles.specItem}>
                <Text style={styles.specItemLabel}>{item.label}</Text>
                <Text style={styles.specItemValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vehicle Maintenance Notes */}
        {vehicle.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>CATATAN PERAWATAN PEMILIK</Text>
            <Text style={styles.notesBody}>"{vehicle.notes}"</Text>
          </View>
        )}
      </ScrollView>
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: MeltuneColors.surfaceDark,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(216, 198, 174, 0.25)',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: MeltuneColors.charcoal,
  },
  plateOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    backgroundColor: MeltuneColors.charcoal,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: MeltuneColors.borderDark,
  },
  plateOverlayText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  bookCta: {
    width: '100%',
  },
  specCard: {
    backgroundColor: 'rgba(36, 37, 34, 0.9)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.lg,
  },
  specCardTitle: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.champagne,
    letterSpacing: 1.2,
    marginBottom: Spacing.md,
  },
  specGrid: {
    gap: Spacing.md,
  },
  specItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: Spacing.xs,
  },
  specItemLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.textMutedDark,
    letterSpacing: 0.8,
  },
  specItemValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.warmIvory,
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: 'rgba(25, 26, 24, 0.8)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: MeltuneColors.burntOrange,
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
    color: MeltuneColors.textSecondaryDark,
    marginTop: 4,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
