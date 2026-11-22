import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';

interface TechnicalListRowProps {
  index?: string | number;
  code?: string;
  title: string;
  subtitle?: string;
  detail?: string;
  value?: string;
  valueSub?: string;
  badge?: string;
  badgeVariant?: 'accent' | 'neutral' | 'success' | 'warning';
  selected?: boolean;
  selectable?: boolean;
  onPress?: () => void;
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
}

export const TechnicalListRow: React.FC<TechnicalListRowProps> = ({
  index,
  code,
  title,
  subtitle,
  detail,
  value,
  valueSub,
  badge,
  badgeVariant = 'accent',
  selected = false,
  selectable = false,
  onPress,
  dark = false,
  style,
  rightElement,
  icon,
}) => {
  const primaryText = dark ? MeltuneColors.warmIvory : MeltuneColors.charcoal;
  const secondaryText = dark ? MeltuneColors.textSecondaryDark : MeltuneColors.textSecondaryLight;
  const mutedText = dark ? MeltuneColors.textMutedDark : MeltuneColors.textMutedLight;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        selected && (dark ? styles.rowSelectedDark : styles.rowSelectedLight),
        pressed && (dark ? styles.rowPressedDark : styles.rowPressedLight),
        style,
      ]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={selectable ? { selected } : undefined}
    >
      {/* Optional Leading Selection / Code / Icon */}
      {(selectable || icon) && (
        <View style={styles.leadingColumn}>
          {selectable ? (
            <View
              style={[
                styles.selectIndicator,
                selected && styles.selectIndicatorActive,
                dark && styles.selectIndicatorDark,
              ]}
            >
              {selected && <View style={styles.selectIndicatorDot} />}
            </View>
          ) : icon ? (
            <View style={styles.iconContainer}>{icon}</View>
          ) : null}
        </View>
      )}

      {/* Main Content Column */}
      <View style={styles.contentColumn}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: primaryText }]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {badge && (
            <View
              style={[
                styles.badge,
                badgeVariant === 'accent' && styles.badgeAccent,
                badgeVariant === 'neutral' && (dark ? styles.badgeNeutralDark : styles.badgeNeutralLight),
                badgeVariant === 'success' && styles.badgeSuccess,
                badgeVariant === 'warning' && styles.badgeWarning,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  badgeVariant === 'accent' && styles.badgeTextAccent,
                  badgeVariant === 'neutral' && { color: secondaryText },
                  badgeVariant === 'success' && styles.badgeTextSuccess,
                  badgeVariant === 'warning' && styles.badgeTextWarning,
                ]}
              >
                {badge}
              </Text>
            </View>
          )}
        </View>

        {subtitle && (
          <Text
            style={[styles.subtitle, { color: secondaryText }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}

        {detail && (
          <Text
            style={[styles.detail, { color: mutedText }]}
            numberOfLines={2}
          >
            {detail}
          </Text>
        )}
      </View>

      {/* Right Column: Values & Minimal Chevron */}
      {(value || valueSub || rightElement || onPress) && (
        <View style={styles.rightColumn}>
          {rightElement ? (
            rightElement
          ) : (
            <>
              {value && (
                <Text
                  style={[
                    styles.value,
                    { color: dark ? MeltuneColors.warmIvory : MeltuneColors.charcoal },
                  ]}
                >
                  {value}
                </Text>
              )}
              {valueSub && (
                <Text style={[styles.valueSub, { color: mutedText }]}>
                  {valueSub}
                </Text>
              )}
            </>
          )}

          {onPress && !rightElement && !value && (
            <ChevronRight size={16} color={mutedText} />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,    // 16px comfortable vertical touch height
    paddingHorizontal: Spacing.xl,  // 24px consistent screen edge padding
    backgroundColor: 'transparent',
    minHeight: 64,
  },
  rowPressedLight: {
    backgroundColor: 'rgba(36, 37, 34, 0.03)',
  },
  rowPressedDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  rowSelectedLight: {
    backgroundColor: 'rgba(217, 107, 58, 0.05)',
  },
  rowSelectedDark: {
    backgroundColor: 'rgba(217, 107, 58, 0.12)',
  },
  leadingColumn: {
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectIndicator: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(36, 37, 34, 0.3)',
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectIndicatorDark: {
    borderColor: 'rgba(216, 198, 174, 0.4)',
  },
  selectIndicatorActive: {
    borderColor: MeltuneColors.burntOrange,
    backgroundColor: MeltuneColors.burntOrange,
  },
  selectIndicatorDot: {
    width: 6,
    height: 6,
    backgroundColor: MeltuneColors.white,
    borderRadius: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentColumn: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body, // 14-16px
    fontWeight: Typography.weight.bold,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption, // 12-14px
    marginTop: 3,
    lineHeight: 18,
  },
  detail: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    marginTop: 4,
    lineHeight: 15,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radius.xs,
  },
  badgeAccent: {
    backgroundColor: 'rgba(217, 107, 58, 0.1)',
  },
  badgeTextAccent: {
    color: MeltuneColors.burntOrange,
  },
  badgeNeutralLight: {
    backgroundColor: 'rgba(36, 37, 34, 0.06)',
  },
  badgeNeutralDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  badgeSuccess: {
    backgroundColor: MeltuneColors.statusSuccessBg,
  },
  badgeTextSuccess: {
    color: MeltuneColors.statusSuccessText,
  },
  badgeWarning: {
    backgroundColor: MeltuneColors.statusWarningBg,
  },
  badgeTextWarning: {
    color: MeltuneColors.statusWarningText,
  },
  badgeText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.4,
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 70,
  },
  value: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    letterSpacing: -0.2,
  },
  valueSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    marginTop: 2,
  },
});
