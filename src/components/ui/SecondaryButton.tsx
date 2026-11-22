import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'outline' | 'subtle' | 'darkOutline';
  size?: 'sm' | 'md' | 'lg';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  icon,
  iconRight,
  style,
  textStyle,
  variant = 'outline',
  size = 'md',
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        pressed && !disabled && styles[`${variant}_pressed`],
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
    >
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
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
  outline_pressed: {
    backgroundColor: MeltuneColors.surfaceLightMuted,
  },
  darkOutline: {
    backgroundColor: 'rgba(36, 37, 34, 0.65)',
    borderWidth: 1,
    borderColor: MeltuneColors.borderDark,
  },
  darkOutline_pressed: {
    backgroundColor: MeltuneColors.charcoal,
  },
  subtle: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  subtle_pressed: {
    backgroundColor: MeltuneColors.warmSand,
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
    fontWeight: Typography.weight.semibold,
  },
  text_outline: {
    color: MeltuneColors.charcoal,
  },
  text_darkOutline: {
    color: MeltuneColors.warmIvory,
  },
  text_subtle: {
    color: MeltuneColors.charcoal,
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
