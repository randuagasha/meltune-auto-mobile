import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Wrench } from 'lucide-react-native';
import { Vehicle } from '@/types';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

interface VehicleHeroProps {
  vehicle: Vehicle;
  onPress?: () => void;
  onBookService?: () => void;
  activeBookingStatus?: string;
}

export const VehicleHero: React.FC<VehicleHeroProps> = ({
  vehicle,
  onPress,
  onBookService,
  activeBookingStatus,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        Shadows.card,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Kendaraan ${vehicle.brand} ${vehicle.model}`}
    >
      {/* Vehicle Photography Area with Subtle Ambient Vignette */}
      <View style={styles.imageContainer}>
        {vehicle.imageUrl ? (
          <Image
            source={{ uri: vehicle.imageUrl }}
            style={styles.vehicleImage}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}

        <LinearGradient
          colors={[
            'rgba(24, 25, 23, 0.05)',
            'rgba(24, 25, 23, 0.55)',
            'rgba(24, 25, 23, 0.92)',
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Content Overlay */}
      <View style={styles.content}>
        {/* Top Minimal Status Indicator */}
        <View style={styles.topRow}>
          <Text style={styles.brandPlate}>
            {vehicle.brand} • {vehicle.licensePlate}
          </Text>

          {activeBookingStatus ? (
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{activeBookingStatus}</Text>
            </View>
          ) : (
            <View style={styles.mileagePill}>
              <Text style={styles.mileageText}>
                {vehicle.mileage ? `${vehicle.mileage.toLocaleString('id-ID')} km` : '-'}
              </Text>
            </View>
          )}
        </View>

        {/* Vehicle Identity */}
        <View style={styles.titleSection}>
          <Text style={styles.modelTitle} numberOfLines={1}>
            {vehicle.model}
          </Text>
          <Text style={styles.specSub}>
            Tahun {vehicle.year} • {vehicle.transmission.toUpperCase()} • Odometer {vehicle.mileage?.toLocaleString('id-ID')} km
          </Text>
        </View>

        {/* Primary Action Button */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={e => {
              e.stopPropagation();
              onBookService?.();
            }}
            style={({ pressed }) => [
              styles.bookButton,
              pressed && styles.bookButtonPressed,
            ]}
          >
            <Wrench size={15} color={MeltuneColors.white} />
            <Text style={styles.bookButtonText}>Reservasi Servis</Text>
          </Pressable>

          <View style={styles.detailsAffordance}>
            <Text style={styles.detailsText}>Detail</Text>
            <ChevronRight size={14} color={MeltuneColors.champagne} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Radius.none,
    overflow: 'hidden',
    backgroundColor: MeltuneColors.surfaceDark,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'rgba(216, 198, 174, 0.22)',
    position: 'relative',
  },
  pressed: {
    opacity: 0.98,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
  content: {
    paddingTop: 130,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brandPlate: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 107, 58, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
  },
  statusText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.white,
    fontWeight: Typography.weight.semibold,
  },
  mileagePill: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  mileageText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.warmSand,
  },
  titleSection: {
    marginBottom: Spacing.xl,
  },
  modelTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 26,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.white,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  specSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.champagne,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(216, 198, 174, 0.15)',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.burntOrange,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xs,
    gap: Spacing.sm,
    minHeight: 44,
  },
  bookButtonPressed: {
    backgroundColor: MeltuneColors.orangePressed,
  },
  bookButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    letterSpacing: 0.3,
  },
  detailsAffordance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  detailsText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.medium,
  },
});
