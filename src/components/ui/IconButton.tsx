import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MeltuneColors, Radius, Spacing, Shadows } from '@/theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'light' | 'dark' | 'orange' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'light',
  size = 'md',
  style,
  accessibilityLabel,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        pressed && styles[`${variant}_pressed`],
        Shadows.subtle,
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  light: {
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
  light_pressed: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
    transform: [{ scale: 0.95 }],
  },
  dark: {
    backgroundColor: MeltuneColors.charcoal,
    borderWidth: 1,
    borderColor: MeltuneColors.borderDark,
  },
  dark_pressed: {
    backgroundColor: MeltuneColors.surfaceDark,
    transform: [{ scale: 0.95 }],
  },
  orange: {
    backgroundColor: MeltuneColors.burntOrange,
  },
  orange_pressed: {
    backgroundColor: MeltuneColors.orangePressed,
    transform: [{ scale: 0.95 }],
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  glass_pressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transform: [{ scale: 0.95 }],
  },
  size_sm: {
    width: 34,
    height: 34,
  },
  size_md: {
    width: 44,
    height: 44,
  },
  size_lg: {
    width: 52,
    height: 52,
  },
});
