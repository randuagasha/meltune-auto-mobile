import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Gauge, Calendar, ChevronRight, Wrench } from 'lucide-react-native';
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
        Shadows.darkElevated,
        pressed && styles.pressed,
      ]}
    >
      {/* Background Vehicle Image with Cockpit Gradient Overlay */}
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
          colors={['rgba(20, 21, 19, 0.2)', 'rgba(25, 26, 24, 0.85)', '#181917']}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Hero Content */}
      <View style={styles.content}>
        {/* Top Badges */}
        <View style={styles.topRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandText}>{vehicle.brand.toUpperCase()}</Text>
          </View>

          {activeBookingStatus ? (
            <View style={styles.liveServiceBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.liveServiceText}>WORKBAY: {activeBookingStatus.toUpperCase()}</Text>
            </View>
          ) : (
            <View style={styles.platePill}>
              <Text style={styles.plateText}>{vehicle.licensePlate}</Text>
            </View>
          )}
        </View>

        {/* Centerpiece Title */}
        <View style={styles.titleSection}>
          <Text style={styles.modelTitle} numberOfLines={1}>
            {vehicle.model}
          </Text>
          <Text style={styles.specEyebrow}>
            {vehicle.year} • {vehicle.engineCode || vehicle.fuelType.toUpperCase()} • {vehicle.transmission.toUpperCase()}
          </Text>
        </View>

        {/* Instrument Cluster Metrics Bar */}
        <View style={styles.instrumentBar}>
          <View style={styles.metricItem}>
            <View style={styles.metricIconBox}>
              <Gauge size={14} color={MeltuneColors.champagne} />
            </View>
            <View>
              <Text style={styles.metricLabel}>ODOMETER</Text>
              <Text style={styles.metricValue}>
                {vehicle.mileage ? `${vehicle.mileage.toLocaleString('id-ID')} KM` : '-'}
              </Text>
            </View>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <View style={styles.metricIconBox}>
              <Calendar size={14} color={MeltuneColors.champagne} />
            </View>
            <View>
              <Text style={styles.metricLabel}>NEXT SERVICE</Text>
              <Text style={styles.metricValue}>
                {vehicle.nextServiceMileage
                  ? `${vehicle.nextServiceMileage.toLocaleString('id-ID')} KM`
                  : 'Siap Inspeksi'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Booking CTA Bar */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={onBookService}
            style={({ pressed }) => [
              styles.bookButton,
              pressed && styles.bookButtonPressed,
            ]}
          >
            <Wrench size={14} color={MeltuneColors.white} />
            <Text style={styles.bookButtonText}>Reservasi Servis Workshop</Text>
          </Pressable>

          <View style={styles.chevronBox}>
            <ChevronRight size={18} color={MeltuneColors.champagne} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: MeltuneColors.surfaceDark,
    borderWidth: 1,
    borderColor: 'rgba(216, 198, 174, 0.25)',
    marginHorizontal: Spacing.lg,
    position: 'relative',
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  imageContainer: {
    height: 220,
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
    paddingTop: 140,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brandBadge: {
    backgroundColor: 'rgba(36, 37, 34, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(216, 198, 174, 0.35)',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.xs,
  },
  brandText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.technicalLabel,
  },
  platePill: {
    backgroundColor: MeltuneColors.charcoal,
    borderWidth: 1,
    borderColor: MeltuneColors.borderDark,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.xs,
  },
  plateText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    letterSpacing: 1,
  },
  liveServiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 107, 58, 0.2)',
    borderWidth: 1,
    borderColor: MeltuneColors.burntOrange,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.xs,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
    marginRight: 5,
  },
  liveServiceText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.white,
    fontWeight: Typography.weight.bold,
  },
  titleSection: {
    marginBottom: Spacing.md,
  },
  modelTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title1,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.white,
    letterSpacing: Typography.letterSpacing.editorialHeading,
  },
  specEyebrow: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.champagne,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  instrumentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 37, 34, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconBox: {
    width: 28,
    height: 28,
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  metricLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.textMutedDark,
    letterSpacing: 1,
  },
  metricValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.warmIvory,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.burntOrange,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  bookButtonPressed: {
    backgroundColor: MeltuneColors.orangePressed,
  },
  bookButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    marginLeft: Spacing.xs,
  },
  chevronBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
