import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Wrench, ShieldCheck, Gauge } from 'lucide-react-native';
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
    >
      <View style={styles.topRow}>
        <View style={styles.imageBox}>
          {vehicle.imageUrl ? (
            <Image
              source={{ uri: vehicle.imageUrl }}
              style={styles.thumbImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.thumbPlaceholder} />
          )}
        </View>

        <View style={styles.infoColumn}>
          <View style={styles.badgeRow}>
            <Text style={styles.brandTag}>{vehicle.brand.toUpperCase()}</Text>
            <View style={styles.plateTag}>
              <Text style={styles.plateText}>{vehicle.licensePlate}</Text>
            </View>
          </View>

          <Text style={styles.modelName} numberOfLines={1}>
            {vehicle.model}
          </Text>

          <Text style={styles.specLine}>
            Tahun {vehicle.year} • {vehicle.fuelType} • {vehicle.transmission}
          </Text>
        </View>
      </View>

      {/* Technical Spec Row */}
      <View style={styles.specGrid}>
        <View style={styles.specCell}>
          <Gauge size={13} color={MeltuneColors.textSecondaryLight} />
          <Text style={styles.specLabel}>Kilometer:</Text>
          <Text style={styles.specValue}>
            {vehicle.mileage ? `${vehicle.mileage.toLocaleString('id-ID')} KM` : '-'}
          </Text>
        </View>

        <View style={styles.specCell}>
          <ShieldCheck size={13} color={MeltuneColors.burntOrange} />
          <Text style={styles.specLabel}>Servis Terakhir:</Text>
          <Text style={styles.specValue}>{vehicle.lastServiceDate || 'Tercatat'}</Text>
        </View>
      </View>

      {/* Card Action Row */}
      <View style={styles.bottomBar}>
        {onBookPress && (
          <Pressable
            onPress={onBookPress}
            style={({ pressed }) => [
              styles.bookAction,
              pressed && styles.bookActionPressed,
            ]}
          >
            <Wrench size={13} color={MeltuneColors.burntOrange} />
            <Text style={styles.bookActionText}>Booking Servis</Text>
          </Pressable>
        )}

        <View style={styles.viewDetailsRow}>
          <Text style={styles.viewDetailsText}>Detail Spesifikasi</Text>
          <ChevronRight size={14} color={MeltuneColors.textSecondaryLight} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
  },
  imageBox: {
    width: 84,
    height: 84,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: MeltuneColors.surfaceLightElevated,
    marginRight: Spacing.md,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxs,
  },
  brandTag: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    letterSpacing: Typography.letterSpacing.technicalLabel,
    marginRight: Spacing.xs,
  },
  plateTag: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
  },
  plateText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.charcoal,
    fontWeight: Typography.weight.bold,
  },
  modelName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    letterSpacing: Typography.letterSpacing.tight,
  },
  specLine: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  specGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: MeltuneColors.surfaceLightMuted,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.md,
  },
  specCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
  },
  specValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
  },
  bookAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'rgba(217, 107, 58, 0.08)',
    borderRadius: Radius.xs,
  },
  bookActionPressed: {
    backgroundColor: 'rgba(217, 107, 58, 0.16)',
  },
  bookActionText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
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
