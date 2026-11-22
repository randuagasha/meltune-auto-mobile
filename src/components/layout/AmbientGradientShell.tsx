import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StyleProp,
  ViewStyle,
  RefreshControlProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export interface AmbientGradientShellProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  headerRight?: React.ReactNode;
  customHeader?: React.ReactNode;
  dark?: boolean;
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  surfaceStyle?: StyleProp<ViewStyle>;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export const AmbientGradientShell: React.FC<AmbientGradientShellProps> = ({
  title,
  subtitle,
  tag,
  showBack = false,
  onBackPress,
  headerRight,
  customHeader,
  dark = false,
  children,
  scrollable = true,
  contentContainerStyle,
  surfaceStyle,
  refreshControl,
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

  const surfaceBg = dark ? MeltuneColors.surfaceDark : MeltuneColors.warmIvory;

  return (
    <View style={styles.rootContainer}>
      {/* LAYER 1: Full-Screen Persistent Gradient Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Base Layer */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#562114' }]} />

        {/* Multi-Point Radial Gradients for Smooth Ambient Color Fields */}
        <Svg
          style={StyleSheet.absoluteFill}
          width="100%"
          height="100%"
        >
          <Defs>
            <RadialGradient
              id="bg_terracotta"
              cx="18%"
              cy="8%"
              rx="65%"
              ry="45%"
              fx="18%"
              fy="8%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#8A341E" stopOpacity={0.95} />
              <Stop offset="45%" stopColor="#7E3828" stopOpacity={0.8} />
              <Stop offset="100%" stopColor="#562114" stopOpacity={0.0} />
            </RadialGradient>

            <RadialGradient
              id="bg_burnt_orange"
              cx="82%"
              cy="10%"
              rx="60%"
              ry="40%"
              fx="82%"
              fy="10%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#D96B3A" stopOpacity={0.92} />
              <Stop offset="50%" stopColor="#BF582D" stopOpacity={0.65} />
              <Stop offset="100%" stopColor="#7E3828" stopOpacity={0.0} />
            </RadialGradient>

            <RadialGradient
              id="bg_champagne"
              cx="50%"
              cy="16%"
              rx="55%"
              ry="35%"
              fx="50%"
              fy="16%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#D8C6AE" stopOpacity={0.38} />
              <Stop offset="60%" stopColor="#E7D9C8" stopOpacity={0.15} />
              <Stop offset="100%" stopColor="#80634D" stopOpacity={0.0} />
            </RadialGradient>

            <RadialGradient
              id="bg_bronze"
              cx="92%"
              cy="28%"
              rx="45%"
              ry="30%"
              fx="92%"
              fy="28%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#80634D" stopOpacity={0.45} />
              <Stop offset="100%" stopColor="#562114" stopOpacity={0.0} />
            </RadialGradient>
          </Defs>

          <Rect width="100%" height="100%" fill="url(#bg_terracotta)" />
          <Rect width="100%" height="100%" fill="url(#bg_burnt_orange)" />
          <Rect width="100%" height="100%" fill="url(#bg_champagne)" />
          <Rect width="100%" height="100%" fill="url(#bg_bronze)" />
        </Svg>

        {/* Subtle Directional Linear Vignette */}
        <LinearGradient
          colors={[
            'rgba(20, 15, 12, 0.15)',
            'rgba(217, 107, 58, 0.12)',
            'rgba(126, 56, 40, 0.4)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.6 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Header Layer (Sits directly on the gradient backdrop) */}
      <View
        style={[
          styles.headerContainer,
          { paddingTop: Math.max(insets.top, 16) + Spacing.xs },
        ]}
      >
        {customHeader ? (
          customHeader
        ) : (
          <View style={styles.defaultHeaderRow}>
            <View style={styles.headerLeftGroup}>
              {showBack && (
                <Pressable
                  onPress={handleBack}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Kembali"
                >
                  <ArrowLeft size={20} color={MeltuneColors.white} />
                </Pressable>
              )}

              <View style={styles.headerTitleColumn}>
                {tag && <Text style={styles.headerTag}>{tag.toUpperCase()}</Text>}
                {title && (
                  <Text numberOfLines={1} style={styles.headerTitle}>
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text numberOfLines={1} style={styles.headerSubtitle}>
                    {subtitle}
                  </Text>
                )}
              </View>
            </View>

            {headerRight && <View style={styles.headerRightGroup}>{headerRight}</View>}
          </View>
        )}
      </View>

      {/* LAYER 2: Large Foreground Content Surface */}
      <View
        style={[
          styles.foregroundSurface,
          { backgroundColor: surfaceBg },
          surfaceStyle,
        ]}
      >
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 110 + Spacing.xl },
              contentContainerStyle,
            ]}
          >
            {children}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.staticContent,
              { paddingBottom: 110 + Spacing.xl },
              contentContainerStyle,
            ]}
          >
            {children}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#562114',
  },
  headerContainer: {
    paddingHorizontal: Spacing.xl, // 24px consistent horizontal padding
    paddingBottom: Spacing.lg,     // 16px bottom breathing room
  },
  defaultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  backButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  headerTitleColumn: {
    flex: 1,
  },
  headerTag: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.bold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 24,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 2,
  },
  headerRightGroup: {
    marginLeft: Spacing.md,
  },
  foregroundSurface: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  scrollContent: {
    paddingTop: Spacing.xl, // 24px top padding inside surface
  },
  staticContent: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
});
