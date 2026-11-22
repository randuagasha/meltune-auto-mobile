import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionTitle,
  onActionPress,
  style,
  dark = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        dark ? styles.containerDark : styles.containerLight,
        style,
      ]}
    >
      <View style={[styles.iconWrapper, dark ? styles.iconDark : styles.iconLight]}>
        {icon}
      </View>

      <Text style={[styles.title, dark ? styles.titleDark : styles.titleLight]}>
        {title}
      </Text>

      <Text
        style={[
          styles.description,
          dark ? styles.descriptionDark : styles.descriptionLight,
        ]}
      >
        {description}
      </Text>

      {actionTitle && onActionPress && (
        <PrimaryButton
          title={actionTitle}
          onPress={onActionPress}
          size="sm"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  containerLight: {
    backgroundColor: MeltuneColors.white,
    borderColor: MeltuneColors.borderLight,
  },
  containerDark: {
    backgroundColor: MeltuneColors.surfaceDarkCard,
    borderColor: MeltuneColors.borderDark,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  iconLight: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  iconDark: {
    backgroundColor: MeltuneColors.surfaceDark,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  titleLight: {
    color: MeltuneColors.charcoal,
  },
  titleDark: {
    color: MeltuneColors.warmIvory,
  },
  description: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.caption,
    maxWidth: 280,
  },
  descriptionLight: {
    color: MeltuneColors.textSecondaryLight,
  },
  descriptionDark: {
    color: MeltuneColors.textSecondaryDark,
  },
  actionButton: {
    marginTop: Spacing.lg,
  },
});
