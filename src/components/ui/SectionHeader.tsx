import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { MeltuneColors, Spacing, Typography } from '@/theme';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  actionText,
  onActionPress,
  style,
  dark = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textColumn}>
        {eyebrow && (
          <Text style={[styles.eyebrow, dark ? styles.eyebrowDark : styles.eyebrowLight]}>
            {eyebrow.toUpperCase()}
          </Text>
        )}
        <Text style={[styles.title, dark ? styles.titleDark : styles.titleLight]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, dark ? styles.subtitleDark : styles.subtitleLight]}>
            {subtitle}
          </Text>
        )}
      </View>

      {actionText && onActionPress && (
        <Pressable
          onPress={onActionPress}
          hitSlop={8}
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  textColumn: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  eyebrow: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.technicalLabel,
    marginBottom: Spacing.xxs,
  },
  eyebrowLight: {
    color: MeltuneColors.burntOrange,
  },
  eyebrowDark: {
    color: MeltuneColors.champagne,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.extrabold,
    letterSpacing: Typography.letterSpacing.tight,
  },
  titleLight: {
    color: MeltuneColors.charcoal,
  },
  titleDark: {
    color: MeltuneColors.warmIvory,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    marginTop: Spacing.xxs,
    lineHeight: Typography.lineHeight.caption,
  },
  subtitleLight: {
    color: MeltuneColors.textSecondaryLight,
  },
  subtitleDark: {
    color: MeltuneColors.textSecondaryDark,
  },
  actionButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
});
