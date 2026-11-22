import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { MeltuneColors, Spacing, Typography } from '@/theme';

interface EditorialSectionProps {
  index?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  dark?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  noHairline?: boolean;
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({
  index,
  eyebrow,
  title,
  subtitle,
  actionText,
  onActionPress,
  dark = false,
  children,
  style,
  headerStyle,
  noHairline = false,
}) => {
  const textColor = dark ? MeltuneColors.warmIvory : MeltuneColors.charcoal;
  const subColor = dark ? MeltuneColors.textSecondaryDark : MeltuneColors.textSecondaryLight;
  const accentColor = dark ? MeltuneColors.champagne : MeltuneColors.burntOrange;
  const dividerColor = dark ? 'rgba(216, 198, 174, 0.16)' : 'rgba(36, 37, 34, 0.08)';

  return (
    <View style={[styles.container, style]}>
      {/* Section Header with Generous Breathing Room */}
      <View style={[styles.header, headerStyle]}>
        <View style={styles.titleColumn}>
          {(index || eyebrow) && (
            <View style={styles.eyebrowRow}>
              {eyebrow && (
                <Text style={[styles.eyebrowText, { color: accentColor }]}>
                  {eyebrow}
                </Text>
              )}
            </View>
          )}

          <Text style={[styles.title, { color: textColor }]}>
            {title}
          </Text>

          {subtitle && (
            <Text style={[styles.subtitle, { color: subColor }]}>
              {subtitle}
            </Text>
          )}
        </View>

        {actionText && (
          <Pressable
            onPress={onActionPress}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
            hitSlop={12}
          >
            <Text style={[styles.actionText, { color: accentColor }]}>
              {actionText}
            </Text>
            <ChevronRight size={14} color={accentColor} />
          </Pressable>
        )}
      </View>

      {!noHairline && (
        <View style={[styles.hairline, { backgroundColor: dividerColor }]} />
      )}

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxxl, // 40px major visual separation
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl, // 24px consistent horizontal padding
    paddingBottom: Spacing.md,
  },
  titleColumn: {
    flex: 1,
    paddingRight: Spacing.lg,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  eyebrowText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2, // 22px
    fontWeight: Typography.weight.bold,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 2,
    minHeight: 32,
  },
  actionButtonPressed: {
    opacity: 0.6,
  },
  actionText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
  },
  hairline: {
    height: 1,
    marginHorizontal: Spacing.xl, // 24px
    marginBottom: Spacing.lg,     // 16px section title to content
  },
  content: {
    // Open content canvas
  },
});
