import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { PREVIEW_VEHICLES } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';

export default function GarageScreen() {
  const router = useRouter();

  const totalOdometer = PREVIEW_VEHICLES.reduce(
    (sum, v) => sum + (v.mileage || 0),
    0
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/vehicle/add')}
      style={({ pressed }) => [
        styles.addHeaderButton,
        pressed && styles.addHeaderButtonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Tambah Kendaraan"
      hitSlop={10}
    >
      <Plus size={20} color={MeltuneColors.white} />
    </Pressable>
  );

  return (
    <AmbientGradientShell
      tag="CUSTOMER GARAGE // BSD"
      title="Garasi Saya"
      subtitle="Koleksi kendaraan dan rekam jejak servis"
      headerRight={renderHeaderRight()}
    >
      {/* 1. Minimal Fleet Summary Strip */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Armada</Text>
          <Text style={styles.summaryValue}>{PREVIEW_VEHICLES.length} Unit</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Jarak Tempuh</Text>
          <Text style={styles.summaryValue}>
            {totalOdometer.toLocaleString('id-ID')} km
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Standar APM</Text>
          <Text style={[styles.summaryValue, { color: MeltuneColors.statusSuccess }]}>
            Terverifikasi
          </Text>
        </View>
      </View>

      {/* 2. Vehicle Collection Items */}
      <View style={styles.vehicleListContainer}>
        {PREVIEW_VEHICLES.map(vehicle => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onPress={() =>
              router.push({
                pathname: '/vehicle/detail',
                params: { id: vehicle.id },
              })
            }
            onBookPress={() => router.push('/booking')}
          />
        ))}
      </View>

      {/* 3. Add Vehicle Action Button */}
      <Pressable
        onPress={() => router.push('/vehicle/add')}
        style={({ pressed }) => [
          styles.addVehicleButton,
          pressed && styles.addVehicleButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Daftarkan Kendaraan Baru"
      >
        <Plus size={18} color={MeltuneColors.burntOrange} />
        <Text style={styles.addVehicleButtonText}>Daftarkan Kendaraan Baru</Text>
      </Pressable>
    </AmbientGradientShell>
  );
}

const styles = StyleSheet.create({
  addHeaderButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addHeaderButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.08)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.xl, // 24px
    marginBottom: Spacing.xxl,    // 32px
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginBottom: 2,
  },
  summaryValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(36, 37, 34, 0.08)',
    marginHorizontal: Spacing.xs,
  },
  vehicleListContainer: {
    paddingHorizontal: Spacing.xl, // 24px
    marginBottom: Spacing.lg,
  },
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xl,
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 58, 0.35)',
    borderRadius: Radius.xs,
    minHeight: 50,
  },
  addVehicleButtonPressed: {
    backgroundColor: 'rgba(217, 107, 58, 0.06)',
  },
  addVehicleButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
});
