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
import { Plus, Car, Wrench, Shield, ArrowUpRight } from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PREVIEW_VEHICLES } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function GarageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const totalOdometer = PREVIEW_VEHICLES.reduce(
    (sum, v) => sum + (v.mileage || 0),
    0
  );

  return (
    <AmbientGradientBackground preset="garageIndustrial">
      <AppHeader
        title="Garasi Saya"
        subtitle="Daftar Kendaraan & Riwayat Spesifikasi Mesin"
        tag="CUSTOMER GARAGE // BSD"
        dark
        rightAction={
          <Pressable
            onPress={() => router.push('/vehicle/add')}
            style={styles.headerAddButton}
            accessibilityLabel="Add vehicle"
          >
            <Plus size={18} color={MeltuneColors.white} />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 90 + Spacing.xxl },
        ]}
      >
        {/* Fleet Overview Bar */}
        <View style={[styles.fleetBar, Shadows.darkElevated]}>
          <View style={styles.fleetCell}>
            <Text style={styles.fleetLabel}>UNIT TERDAFTAR</Text>
            <Text style={styles.fleetValue}>{PREVIEW_VEHICLES.length} Mobil</Text>
          </View>

          <View style={styles.fleetDivider} />

          <View style={styles.fleetCell}>
            <Text style={styles.fleetLabel}>TOTAL ODOTEL</Text>
            <Text style={styles.fleetValue}>
              {totalOdometer.toLocaleString('id-ID')} KM
            </Text>
          </View>

          <View style={styles.fleetDivider} />

          <View style={styles.fleetCell}>
            <Text style={styles.fleetLabel}>STANDAR APM</Text>
            <Text style={styles.fleetValue}>Tersertifikasi</Text>
          </View>
        </View>

        {/* Vehicles List */}
        <View style={styles.vehicleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Armada Mobil Anda</Text>
            <Text style={styles.sectionDesc}>
              Ketuk kendaraan untuk memeriksa nomor sasis VIN, spesifikasi oli mesin yang disetujui, dan log servis.
            </Text>
          </View>

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

        {/* Register New Vehicle Banner */}
        <Pressable
          onPress={() => router.push('/vehicle/add')}
          style={({ pressed }) => [
            styles.registerBanner,
            pressed && styles.registerBannerPressed,
          ]}
        >
          <View style={styles.registerIconBox}>
            <Plus size={22} color={MeltuneColors.burntOrange} />
          </View>
          <View style={styles.registerTextColumn}>
            <Text style={styles.registerTitle}>Daftarkan Mobil Lain ke Garasi</Text>
            <Text style={styles.registerSub}>
              Tambahkan data plat nomor dan kilometer untuk kemudahan reservasi servis berikutnya.
            </Text>
          </View>
          <ArrowUpRight size={18} color={MeltuneColors.champagne} />
        </Pressable>

        {/* Maintenance Telemetry Notice */}
        <View style={styles.infoBox}>
          <Shield size={20} color={MeltuneColors.champagne} />
          <View style={styles.infoTextColumn}>
            <Text style={styles.infoTitle}>Rekomendasi Pemeliharaan Presisi</Text>
            <Text style={styles.infoDesc}>
              Setiap mobil yang terdaftar dipantau berdasarkan interval waktu kalender dan jarak tempuh dinamis untuk mencegah kerusakan dini komponen mesin dan rem.
            </Text>
          </View>
        </View>
      </ScrollView>
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
  },
  headerAddButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fleetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 37, 34, 0.85)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(216, 198, 174, 0.25)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  fleetCell: {
    flex: 1,
    alignItems: 'center',
  },
  fleetLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.champagne,
    letterSpacing: 1,
  },
  fleetValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    marginTop: 2,
  },
  fleetDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  vehicleSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.warmIvory,
  },
  sectionDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryDark,
    marginTop: 2,
    lineHeight: 18,
  },
  registerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 37, 34, 0.9)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(217, 107, 58, 0.5)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  registerBannerPressed: {
    backgroundColor: 'rgba(43, 44, 40, 0.98)',
  },
  registerIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(217, 107, 58, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  registerTextColumn: {
    flex: 1,
  },
  registerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
  },
  registerSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryDark,
    marginTop: 2,
    lineHeight: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(25, 26, 24, 0.8)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoTextColumn: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.champagne,
  },
  infoDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedDark,
    marginTop: 2,
    lineHeight: 16,
  },
});
