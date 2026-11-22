import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'orange' | 'charcoal';
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconRight,
  style,
  textStyle,
  variant = 'orange',
  size = 'md',
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        pressed && isInteractive && styles[`${variant}_pressed`],
        disabled && styles.disabled,
        Shadows.subtle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive }}
    >
      {loading ? (
        <ActivityIndicator color={MeltuneColors.white} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              styles[`text_${variant}`],
              styles[`text_size_${size}`],
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  orange: {
    backgroundColor: MeltuneColors.burntOrange,
  },
  orange_pressed: {
    backgroundColor: MeltuneColors.orangePressed,
    transform: [{ scale: 0.985 }],
  },
  charcoal: {
    backgroundColor: MeltuneColors.charcoal,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  charcoal_pressed: {
    backgroundColor: '#1E1F1C',
    transform: [{ scale: 0.985 }],
  },
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 38,
  },
  size_md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    minHeight: 56,
  },
  disabled: {
    opacity: 0.45,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  text: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.normal,
  },
  text_orange: {
    color: MeltuneColors.white,
  },
  text_charcoal: {
    color: MeltuneColors.warmIvory,
  },
  text_size_sm: {
    fontSize: Typography.size.caption,
  },
  text_size_md: {
    fontSize: Typography.size.body,
  },
  text_size_lg: {
    fontSize: Typography.size.headline,
  },
});
