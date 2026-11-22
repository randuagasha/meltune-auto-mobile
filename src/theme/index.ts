import { Platform } from 'react-native';

export const MeltuneColors = {
  // Primary Meltune Palette
  warmIvory: '#F5F4F0',
  white: '#FFFFFF',
  charcoal: '#242522',
  burntOrange: '#D96B3A',
  orangePressed: '#BF582D',

  // Supporting Automotive Palette
  warmSand: '#E7D9C8',
  champagne: '#D8C6AE',
  graphite: '#48453E',
  bronze: '#80634D',
  deepTerracotta: '#7E3828',
  softCream: '#F0E9DD',

  // Dark & Industrial Surfaces
  surfaceDark: '#191A18',
  surfaceDarkElevated: '#242522',
  surfaceDarkCard: '#2B2C28',
  surfaceLight: '#FFFFFF',
  surfaceLightElevated: '#EDEAE2',
  surfaceLightMuted: '#F0ECE3',

  // Technical & Accent Borders
  borderLight: '#E4E1D9',
  borderDark: '#3A3B36',
  borderWarm: '#D8C6AE',
  borderAccent: '#D96B3A',

  // Text Hierarchy
  textPrimaryDark: '#F5F4F0',
  textSecondaryDark: '#A8A7A0',
  textMutedDark: '#75746E',
  textPrimaryLight: '#242522',
  textSecondaryLight: '#65665E',
  textMutedLight: '#8C8D84',

  // Status Colors (Automotive gauge inspired)
  statusSuccess: '#10B981',
  statusSuccessBg: '#ECFDF5',
  statusSuccessText: '#065F46',
  statusWarning: '#F59E0B',
  statusWarningBg: '#FFFBEB',
  statusWarningText: '#92400E',
  statusDanger: '#EF4444',
  statusDangerBg: '#FEF2F2',
  statusDangerText: '#991B1B',
  statusInfo: '#3B82F6',
  statusInfoBg: '#EFF6FF',
  statusInfoText: '#1E40AF',
} as const;

export const MeltuneGradients = {
  // Approved Meltune Gradient Compositions
  warmEditorial: ['#F5F4F0', '#E7D9C8', '#D96B3A'] as [string, string, string],
  graphiteMetallic: ['#242522', '#48453E', '#80634D'] as [string, string, string],
  softLuxury: ['#FFFFFF', '#F0E9DD', '#D8C6AE'] as [string, string, string],
  performanceAccent: ['#D96B3A', '#BF582D', '#7E3828'] as [string, string, string],
  deepIndustrial: ['#141513', '#242522', '#343630'] as [string, string, string],
  subtleIvory: ['#FAF9F6', '#F5F4F0', '#EDEAE2'] as [string, string, string],
  heroCockpit: ['#181917', '#252623', '#1B1C1A'] as [string, string, string],
  cardDarkOverlay: ['rgba(36, 37, 34, 0.95)', 'rgba(43, 44, 40, 0.98)'] as [string, string],
  cardLightOverlay: ['rgba(255, 255, 255, 0.98)', 'rgba(245, 244, 240, 0.95)'] as [string, string],
  amberGlow: ['rgba(217, 107, 58, 0.15)', 'rgba(217, 107, 58, 0.00)'] as [string, string],
} as const;

export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const Radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 9999,
} as const;

export const Typography = {
  fontFamily: Platform.select({
    ios: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    android: 'Manrope, Roboto, sans-serif',
    default: 'Manrope, system-ui, sans-serif',
  }),
  fontFamilyMono: Platform.select({
    ios: 'ui-monospace, "SF Mono", Menlo, monospace',
    android: 'monospace',
    default: 'monospace',
  }),

  // Font Sizes
  size: {
    hero: 32,
    title1: 26,
    title2: 22,
    title3: 18,
    headline: 16,
    body: 14,
    callout: 13,
    caption: 12,
    technical: 11,
    micro: 10,
  },

  // Line Heights
  lineHeight: {
    hero: 38,
    title1: 32,
    title2: 28,
    title3: 24,
    headline: 22,
    body: 20,
    callout: 18,
    caption: 16,
    technical: 14,
    micro: 12,
  },

  // Font Weights
  weight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    editorialHeading: -0.8,
    technicalLabel: 1.2,
    badgeCaps: 1.5,
  },
} as const;

export const Shadows = {
  subtle: Platform.select({
    ios: {
      shadowColor: '#242522',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#242522',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  darkElevated: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
  accentGlow: Platform.select({
    ios: {
      shadowColor: '#D96B3A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
} as const;
