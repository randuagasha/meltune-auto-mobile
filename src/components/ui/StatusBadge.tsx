import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';
import { BookingStatus, OrderStatus } from '@/types';

type BadgeStatus = BookingStatus | OrderStatus | 'active' | 'inactive' | 'verified';

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, style }) => {
  const config = (() => {
    switch (status) {
      case 'in_progress':
      case 'processing':
        return {
          bg: '#FEF3C7',
          text: '#92400E',
          defaultLabel: 'Dalam Pengerjaan',
          pulse: true,
        };
      case 'confirmed':
      case 'ready_for_pickup':
        return {
          bg: '#D1FAE5',
          text: '#065F46',
          defaultLabel: 'Terkonfirmasi',
          pulse: false,
        };
      case 'completed':
        return {
          bg: '#E0E7FF',
          text: '#3730A3',
          defaultLabel: 'Selesai',
          pulse: false,
        };
      case 'waiting_for_parts':
        return {
          bg: '#EDE9FE',
          text: '#5B21B6',
          defaultLabel: 'Menunggu Suku Cadang',
          pulse: false,
        };
      case 'cancelled':
      case 'rejected':
        return {
          bg: '#FEE2E2',
          text: '#991B1B',
          defaultLabel: 'Dibatalkan',
          pulse: false,
        };
      case 'pending':
      default:
        return {
          bg: '#FFEDD5',
          text: '#9A3412',
          defaultLabel: 'Menunggu Konfirmasi',
          pulse: false,
        };
    }
  })();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      <View
        style={[
          styles.indicatorDot,
          { backgroundColor: config.text },
          config.pulse && styles.pulseDot,
        ]}
      />
      <Text style={[styles.text, { color: config.text }]}>
        {label || config.defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    marginRight: 5,
  },
  pulseDot: {
    // Distinct visual emphasis
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  text: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.3,
  },
});
