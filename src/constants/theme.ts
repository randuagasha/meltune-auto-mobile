import { MeltuneColors, Spacing as ThemeSpacing } from '@/theme';

export const Colors = {
  light: {
    text: MeltuneColors.charcoal,
    background: MeltuneColors.warmIvory,
    backgroundElement: MeltuneColors.surfaceLightElevated,
    backgroundSelected: MeltuneColors.warmSand,
    textSecondary: MeltuneColors.textSecondaryLight,
    tint: MeltuneColors.burntOrange,
  },
  dark: {
    text: MeltuneColors.warmIvory,
    background: MeltuneColors.charcoal,
    backgroundElement: MeltuneColors.surfaceDarkCard,
    backgroundSelected: MeltuneColors.surfaceDarkElevated,
    textSecondary: MeltuneColors.textSecondaryDark,
    tint: MeltuneColors.burntOrange,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  sans: 'normal',
  serif: 'serif',
  rounded: 'normal',
  mono: 'monospace',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = 70;
export const MaxContentWidth = 800;
