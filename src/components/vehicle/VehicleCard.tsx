import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Wrench } from 'lucide-react-native';
import { Vehicle } from '@/types';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  onBookPress?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPress,
  onBookPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        Shadows.card,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Kendaraan ${vehicle.brand} ${vehicle.model}`}
    >
      {/* Spacious Vehicle Image Showcase */}
      <View style={styles.imageWrapper}>
        {vehicle.imageUrl ? (
          <Image
            source={{ uri: vehicle.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderBrand}>{vehicle.brand}</Text>
          </View>
        )}

        {/* Quiet License Plate Badge */}
        <View style={styles.plateTag}>
          <Text style={styles.plateText}>{vehicle.licensePlate}</Text>
        </View>
      </View>

      {/* Vehicle Identity & Technical Specifications */}
      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.modelName} numberOfLines={1}>
            {vehicle.model}
          </Text>
          <Text style={styles.yearText}>Tahun {vehicle.year}</Text>
        </View>

        <Text style={styles.specSummary}>
          {vehicle.fuelType.toUpperCase()} • {vehicle.transmission.toUpperCase()}
          {vehicle.engineCode ? ` • ${vehicle.engineCode}` : ''}
        </Text>

        {/* Clean Spec Grid with Generous Spacing */}
        <View style={styles.specGrid}>
          <View style={styles.specCell}>
            <Text style={styles.specLabel}>Odometer</Text>
            <Text style={styles.specValue}>
              {vehicle.mileage ? `${vehicle.mileage.toLocaleString('id-ID')} km` : '-'}
            </Text>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specCell}>
            <Text style={styles.specLabel}>Servis Terakhir</Text>
            <Text style={styles.specValue}>
              {vehicle.lastServiceDate || 'Workshop BSD'}
            </Text>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specCell}>
            <Text style={styles.specLabel}>Rekomendasi Oli</Text>
            <Text style={[styles.specValue, { color: MeltuneColors.burntOrange }]}>
              0W-20 APM
            </Text>
          </View>
        </View>

        {/* Card Action Row */}
        <View style={styles.bottomBar}>
          {onBookPress && (
            <Pressable
              onPress={e => {
                e.stopPropagation();
                onBookPress();
              }}
              style={({ pressed }) => [
                styles.bookButton,
                pressed && styles.bookButtonPressed,
              ]}
            >
              <Wrench size={14} color={MeltuneColors.burntOrange} />
              <Text style={styles.bookButtonText}>Reservasi Servis</Text>
            </Pressable>
          )}

          <View style={styles.viewDetailsRow}>
            <Text style={styles.viewDetailsText}>Detail Spesifikasi</Text>
            <ChevronRight size={14} color={MeltuneColors.textSecondaryLight} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.1)',
    marginBottom: Spacing.xl, // 24px between vehicle cards
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.98,
  },
  imageWrapper: {
    width: '100%',
    height: 180, // Spacious image area
    backgroundColor: MeltuneColors.surfaceLightElevated,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: MeltuneColors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderBrand: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 16,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.bold,
  },
  plateTag: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(36, 37, 34, 0.85)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  plateText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.white,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: Spacing.xl, // 24px card internal padding
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  modelName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline, // 16-18px
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  yearText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
  },
  specSummary: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginBottom: Spacing.lg,
  },
  specGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.surfaceLightElevated,
    borderRadius: Radius.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  specCell: {
    flex: 1,
  },
  specDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(36, 37, 34, 0.1)',
    marginHorizontal: Spacing.sm,
  },
  specLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginBottom: 2,
  },
  specValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(36, 37, 34, 0.08)',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(217, 107, 58, 0.08)',
  },
  bookButtonPressed: {
    backgroundColor: 'rgba(217, 107, 58, 0.16)',
  },
  bookButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
  },
});
