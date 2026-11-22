import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { MeltuneColors, Spacing, Typography } from '@/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  tag,
  showBack = false,
  onBackPress,
  rightAction,
  dark = false,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 16) + Spacing.xs },
        dark ? styles.containerDark : styles.containerLight,
        style,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftRow}>
          {showBack && (
            <Pressable
              onPress={handleBack}
              hitSlop={12}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
              accessibilityLabel="Go back"
            >
              <ArrowLeft
                size={22}
                color={dark ? MeltuneColors.warmIvory : MeltuneColors.charcoal}
              />
            </Pressable>
          )}

          <View style={styles.titleColumn}>
            {tag && (
              <Text style={[styles.tag, dark ? styles.tagDark : styles.tagLight]}>
                {tag.toUpperCase()}
              </Text>
            )}
            <Text
              numberOfLines={1}
              style={[styles.title, dark ? styles.titleDark : styles.titleLight]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                numberOfLines={1}
                style={[styles.subtitle, dark ? styles.subtitleDark : styles.subtitleLight]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl, // 24px consistent horizontal padding
    paddingBottom: Spacing.lg,     // 16px bottom breathing room
  },
  containerLight: {
    backgroundColor: 'transparent',
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  titleColumn: {
    flex: 1,
  },
  tag: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.technicalLabel,
    marginBottom: 1,
  },
  tagLight: {
    color: MeltuneColors.burntOrange,
  },
  tagDark: {
    color: MeltuneColors.champagne,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.extrabold,
    letterSpacing: Typography.letterSpacing.editorialHeading,
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
    marginTop: 1,
  },
  subtitleLight: {
    color: MeltuneColors.textSecondaryLight,
  },
  subtitleDark: {
    color: MeltuneColors.textSecondaryDark,
  },
  rightAction: {
    marginLeft: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
