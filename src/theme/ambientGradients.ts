import { MeltuneColors } from './index';

export interface AmbientStop {
  offset: string;
  color: string;
  opacity: number;
}

export interface AmbientRadialField {
  id: string;
  cx: string;
  cy: string;
  rx: string;
  ry: string;
  fx?: string;
  fy?: string;
  stops: AmbientStop[];
}

export interface AmbientGradientConfig {
  baseColor: string;
  linearOverlay?: {
    colors: readonly [string, string, ...string[]];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  radialFields: AmbientRadialField[];
  hairlineColor?: string;
}

export type AmbientPresetKey =
  | 'homeAmbient'
  | 'bookingWarm'
  | 'garageIndustrial'
  | 'shopLuxury'
  | 'profileLuxury'
  | 'cockpitDark'
  | 'deepAuth'
  | 'subtleIvory'
  // Backward compatibility alias keys
  | 'warmEditorial'
  | 'graphiteMetallic'
  | 'softLuxury'
  | 'performanceAccent'
  | 'deepIndustrial'
  | 'heroCockpit';

export const AMBIENT_GRADIENT_PRESETS: Record<AmbientPresetKey, AmbientGradientConfig> = {
  // A. HOME — WARM AUTOMOTIVE AMBIENT
  homeAmbient: {
    baseColor: MeltuneColors.warmIvory,
    linearOverlay: {
      colors: [
        'rgba(255, 255, 255, 0.55)',
        'rgba(245, 244, 240, 0.12)',
        'rgba(217, 107, 58, 0.035)',
      ] as const,
      start: { x: 0.1, y: 0.0 },
      end: { x: 0.9, y: 1.0 },
    },
    radialFields: [
      {
        id: 'home_champagne',
        cx: '16%',
        cy: '12%',
        rx: '56%',
        ry: '42%',
        stops: [
          { offset: '0%', color: MeltuneColors.champagne, opacity: 0.42 },
          { offset: '40%', color: MeltuneColors.champagne, opacity: 0.20 },
          { offset: '75%', color: MeltuneColors.warmSand, opacity: 0.07 },
          { offset: '100%', color: MeltuneColors.warmIvory, opacity: 0.0 },
        ],
      },
      {
        id: 'home_sand_center',
        cx: '50%',
        cy: '42%',
        rx: '66%',
        ry: '50%',
        stops: [
          { offset: '0%', color: MeltuneColors.warmSand, opacity: 0.38 },
          { offset: '50%', color: MeltuneColors.warmSand, opacity: 0.16 },
          { offset: '100%', color: MeltuneColors.warmSand, opacity: 0.0 },
        ],
      },
      {
        id: 'home_burnt_orange',
        cx: '88%',
        cy: '78%',
        rx: '52%',
        ry: '46%',
        stops: [
          { offset: '0%', color: MeltuneColors.burntOrange, opacity: 0.18 },
          { offset: '45%', color: MeltuneColors.burntOrange, opacity: 0.07 },
          { offset: '80%', color: MeltuneColors.orangePressed, opacity: 0.02 },
          { offset: '100%', color: MeltuneColors.burntOrange, opacity: 0.0 },
        ],
      },
      {
        id: 'home_cream_highlight',
        cx: '72%',
        cy: '20%',
        rx: '46%',
        ry: '36%',
        stops: [
          { offset: '0%', color: MeltuneColors.softCream, opacity: 0.50 },
          { offset: '60%', color: MeltuneColors.softCream, opacity: 0.16 },
          { offset: '100%', color: MeltuneColors.softCream, opacity: 0.0 },
        ],
      },
    ],
    hairlineColor: 'rgba(216, 198, 174, 0.4)',
  },

  // B. BOOKING — REFINED WARM GRADIENT
  bookingWarm: {
    baseColor: MeltuneColors.warmIvory,
    linearOverlay: {
      colors: [
        'rgba(255, 255, 255, 0.45)',
        'rgba(240, 233, 221, 0.14)',
        'transparent',
      ] as const,
      start: { x: 0.5, y: 0.0 },
      end: { x: 0.5, y: 1.0 },
    },
    radialFields: [
      {
        id: 'book_ivory_champagne',
        cx: '30%',
        cy: '10%',
        rx: '55%',
        ry: '36%',
        stops: [
          { offset: '0%', color: MeltuneColors.champagne, opacity: 0.36 },
          { offset: '55%', color: MeltuneColors.champagne, opacity: 0.12 },
          { offset: '100%', color: MeltuneColors.champagne, opacity: 0.0 },
        ],
      },
      {
        id: 'book_terracotta_progress',
        cx: '80%',
        cy: '28%',
        rx: '45%',
        ry: '38%',
        stops: [
          { offset: '0%', color: MeltuneColors.deepTerracotta, opacity: 0.10 },
          { offset: '50%', color: MeltuneColors.burntOrange, opacity: 0.05 },
          { offset: '100%', color: MeltuneColors.deepTerracotta, opacity: 0.0 },
        ],
      },
      {
        id: 'book_sand_lower',
        cx: '35%',
        cy: '80%',
        rx: '65%',
        ry: '50%',
        stops: [
          { offset: '0%', color: MeltuneColors.warmSand, opacity: 0.40 },
          { offset: '55%', color: MeltuneColors.warmSand, opacity: 0.14 },
          { offset: '100%', color: MeltuneColors.warmSand, opacity: 0.0 },
        ],
      },
    ],
    hairlineColor: 'rgba(216, 198, 174, 0.35)',
  },

  // C. GARAGE — INDUSTRIAL METALLIC
  garageIndustrial: {
    baseColor: '#1E1F1D',
    linearOverlay: {
      colors: [
        'rgba(255, 255, 255, 0.05)',
        'transparent',
        'rgba(128, 99, 77, 0.09)',
      ] as const,
      start: { x: 0.0, y: 0.0 },
      end: { x: 1.0, y: 1.0 },
    },
    radialFields: [
      {
        id: 'gar_bronze_top',
        cx: '82%',
        cy: '18%',
        rx: '55%',
        ry: '45%',
        stops: [
          { offset: '0%', color: MeltuneColors.bronze, opacity: 0.32 },
          { offset: '50%', color: MeltuneColors.bronze, opacity: 0.14 },
          { offset: '100%', color: MeltuneColors.bronze, opacity: 0.0 },
        ],
      },
      {
        id: 'gar_graphite_shadow',
        cx: '25%',
        cy: '45%',
        rx: '55%',
        ry: '45%',
        stops: [
          { offset: '0%', color: '#141513', opacity: 0.60 },
          { offset: '60%', color: MeltuneColors.surfaceDark, opacity: 0.25 },
          { offset: '100%', color: '#1E1F1D', opacity: 0.0 },
        ],
      },
      {
        id: 'gar_copper_lower',
        cx: '15%',
        cy: '82%',
        rx: '50%',
        ry: '42%',
        stops: [
          { offset: '0%', color: MeltuneColors.burntOrange, opacity: 0.14 },
          { offset: '45%', color: MeltuneColors.orangePressed, opacity: 0.05 },
          { offset: '100%', color: MeltuneColors.burntOrange, opacity: 0.0 },
        ],
      },
      {
        id: 'gar_champagne_luster',
        cx: '50%',
        cy: '6%',
        rx: '42%',
        ry: '30%',
        stops: [
          { offset: '0%', color: MeltuneColors.champagne, opacity: 0.10 },
          { offset: '55%', color: MeltuneColors.champagne, opacity: 0.03 },
          { offset: '100%', color: MeltuneColors.champagne, opacity: 0.0 },
        ],
      },
    ],
    hairlineColor: 'rgba(216, 198, 174, 0.2)',
  },

  // D. SHOP — EDITORIAL LUXURY
  shopLuxury: {
    baseColor: '#FAF9F6',
    linearOverlay: {
      colors: [
        'rgba(255, 255, 255, 0.65)',
        'transparent',
        'rgba(231, 217, 200, 0.12)',
      ] as const,
      start: { x: 0.0, y: 0.0 },
      end: { x: 0.8, y: 0.9 },
    },
    radialFields: [
      {
        id: 'shop_cream_upper',
        cx: '45%',
        cy: '15%',
        rx: '65%',
        ry: '40%',
        stops: [
          { offset: '0%', color: MeltuneColors.softCream, opacity: 0.55 },
          { offset: '60%', color: MeltuneColors.softCream, opacity: 0.18 },
          { offset: '100%', color: MeltuneColors.softCream, opacity: 0.0 },
        ],
      },
      {
        id: 'shop_champagne_lower',
        cx: '18%',
        cy: '68%',
        rx: '50%',
        ry: '45%',
        stops: [
          { offset: '0%', color: MeltuneColors.champagne, opacity: 0.26 },
          { offset: '55%', color: MeltuneColors.champagne, opacity: 0.08 },
          { offset: '100%', color: MeltuneColors.champagne, opacity: 0.0 },
        ],
      },
      {
        id: 'shop_orange_accent',
        cx: '85%',
        cy: '32%',
        rx: '42%',
        ry: '35%',
        stops: [
          { offset: '0%', color: MeltuneColors.burntOrange, opacity: 0.09 },
          { offset: '50%', color: MeltuneColors.burntOrange, opacity: 0.03 },
          { offset: '100%', color: MeltuneColors.burntOrange, opacity: 0.0 },
        ],
      },
    ],
    hairlineColor: 'rgba(216, 198, 174, 0.35)',
  },

  // E. PROFILE — SOFT LUXURY
  profileLuxury: {
    baseColor: MeltuneColors.warmIvory,
    linearOverlay: {
      colors: [
        'rgba(255, 255, 255, 0.50)',
        'transparent',
        'rgba(231, 217, 200, 0.15)',
      ] as const,
      start: { x: 0.2, y: 0.0 },
      end: { x: 0.8, y: 1.0 },
    },
    radialFields: [
      {
        id: 'prof_sand_upper',
        cx: '20%',
        cy: '22%',
        rx: '50%',
        ry: '40%',
        stops: [
          { offset: '0%', color: MeltuneColors.warmSand, opacity: 0.45 },
          { offset: '55%', color: MeltuneColors.warmSand, opacity: 0.16 },
          { offset: '100%', color: MeltuneColors.warmSand, opacity: 0.0 },
        ],
      },
      {
        id: 'prof_champagne_center',
        cx: '78%',
        cy: '50%',
        rx: '58%',
        ry: '48%',
        stops: [
          { offset: '0%', color: MeltuneColors.champagne, opacity: 0.32 },
          { offset: '50%', color: MeltuneColors.champagne, opacity: 0.11 },
          { offset: '100%', color: MeltuneColors.champagne, opacity: 0.0 },
        ],
      },
      {
        id: 'prof_terracotta_lower',
        cx: '50%',
        cy: '85%',
        rx: '46%',
        ry: '38%',
        stops: [
          { offset: '0%', color: MeltuneColors.deepTerracotta, opacity: 0.08 },
          { offset: '50%', color: MeltuneColors.burntOrange, opacity: 0.03 },
          { offset: '100%', color: MeltuneColors.deepTerracotta, opacity: 0.0 },
        ],
      },
      {
        id: 'prof_ivory_top',
        cx: '50%',
        cy: '5%',
        rx: '40%',
        ry: '25%',
        stops: [
          { offset: '0%', color: MeltuneColors.white, opacity: 0.60 },
          { offset: '60%', color: MeltuneColors.white, opacity: 0.15 },
          { offset: '100%', color: MeltuneColors.white, opacity: 0.0 },
        ],
      },
    ],
    hairlineColor: 'rgba(216, 198, 174, 0.4)',
  },

  // F. COCKPIT TELEMETRY (Live Service Tracking, Vehicle Detail)
  cockpitDark: {
    baseColor: '#151614',
    linearOverlay: {
      colors: [
        'rgba(255, 255, 255, 0.035)',
        'transparent',
        'rgba(217, 107, 58, 0.05)',
      ] as const,
      start: { x: 0.0, y: 0.1 },
      end: { x: 1.0, y: 0.9 },
    },
    radialFields: [
      {
        id: 'cockpit_orange_beacon',
        cx: '50%',
        cy: '10%',
        rx: '48%',
        ry: '35%',
        stops: [
          { offset: '0%', color: MeltuneColors.burntOrange, opacity: 0.22 },
          { offset: '45%', color: MeltuneColors.burntOrange, opacity: 0.08 },
          { offset: '100%', color: MeltuneColors.burntOrange, opacity: 0.0 },
        ],
      },
      {
        id: 'cockpit_bronze_ambient',
        cx: '85%',
        cy: '72%',
        rx: '52%',
        ry: '46%',
        stops: [
          { offset: '0%', color: MeltuneColors.bronze, opacity: 0.18 },
          { offset: '50%', color: MeltuneColors.bronze, opacity: 0.06 },
          { offset: '100%', color: MeltuneColors.bronze, opacity: 0.0 },
        ],
      },
      {
        id: 'cockpit_graphite_shadow',
        cx: '15%',
        cy: '85%',
        rx: '50%',
        ry: '42%',
        stops: [
          { offset: '0%', color: '#0E0F0D', opacity: 0.65 },
          { offset: '60%', color: '#151614', opacity: 0.20 },
          { offset: '100%', color: '#151614', opacity: 0.0 },
        ],
      },
    ],
    hairlineColor: 'rgba(255, 255, 255, 0.08)',
  },

  // G. DEEP AUTH (Login, Register, Forgot Password)
  deepAuth: {
    baseColor: '#181917',
    linearOverlay: {
      colors: [
        'rgba(255, 255, 255, 0.04)',
        'transparent',
        'rgba(128, 99, 77, 0.06)',
      ] as const,
      start: { x: 0.5, y: 0.0 },
      end: { x: 0.5, y: 1.0 },
    },
    radialFields: [
      {
        id: 'auth_orange_glow',
        cx: '50%',
        cy: '8%',
        rx: '52%',
        ry: '38%',
        stops: [
          { offset: '0%', color: MeltuneColors.burntOrange, opacity: 0.24 },
          { offset: '45%', color: MeltuneColors.burntOrange, opacity: 0.09 },
          { offset: '100%', color: MeltuneColors.burntOrange, opacity: 0.0 },
        ],
      },
      {
        id: 'auth_champagne_accent',
        cx: '18%',
        cy: '76%',
        rx: '46%',
        ry: '40%',
        stops: [
          { offset: '0%', color: MeltuneColors.champagne, opacity: 0.12 },
          { offset: '55%', color: MeltuneColors.champagne, opacity: 0.03 },
          { offset: '100%', color: MeltuneColors.champagne, opacity: 0.0 },
        ],
      },
      {
        id: 'auth_bronze_depth',
        cx: '82%',
        cy: '86%',
        rx: '50%',
        ry: '45%',
        stops: [
          { offset: '0%', color: MeltuneColors.bronze, opacity: 0.16 },
          { offset: '50%', color: MeltuneColors.bronze, opacity: 0.05 },
          { offset: '100%', color: MeltuneColors.bronze, opacity: 0.0 },
        ],
      },
    ],
    hairlineColor: 'rgba(216, 198, 174, 0.25)',
  },

  // H. SUBTLE IVORY (Notifications, Booking History, Support, Forms)
  subtleIvory: {
    baseColor: '#F7F6F2',
    linearOverlay: {
      colors: [
        'rgba(255, 255, 255, 0.40)',
        'transparent',
        'rgba(231, 217, 200, 0.10)',
      ] as const,
      start: { x: 0.5, y: 0.0 },
      end: { x: 0.5, y: 1.0 },
    },
    radialFields: [
      {
        id: 'sub_champagne_corner',
        cx: '16%',
        cy: '16%',
        rx: '50%',
        ry: '38%',
        stops: [
          { offset: '0%', color: MeltuneColors.champagne, opacity: 0.32 },
          { offset: '55%', color: MeltuneColors.champagne, opacity: 0.10 },
          { offset: '100%', color: MeltuneColors.champagne, opacity: 0.0 },
        ],
      },
      {
        id: 'sub_sand_corner',
        cx: '82%',
        cy: '72%',
        rx: '58%',
        ry: '48%',
        stops: [
          { offset: '0%', color: MeltuneColors.warmSand, opacity: 0.36 },
          { offset: '55%', color: MeltuneColors.warmSand, opacity: 0.12 },
          { offset: '100%', color: MeltuneColors.warmSand, opacity: 0.0 },
        ],
      },
      {
        id: 'sub_cream_mid',
        cx: '50%',
        cy: '46%',
        rx: '48%',
        ry: '38%',
        stops: [
          { offset: '0%', color: MeltuneColors.softCream, opacity: 0.42 },
          { offset: '60%', color: MeltuneColors.softCream, opacity: 0.14 },
          { offset: '100%', color: MeltuneColors.softCream, opacity: 0.0 },
        ],
      },
    ],
    hairlineColor: 'rgba(216, 198, 174, 0.3)',
  },

  // Backward compatibility alias mappings
  warmEditorial: null as any,
  graphiteMetallic: null as any,
  softLuxury: null as any,
  performanceAccent: null as any,
  deepIndustrial: null as any,
  heroCockpit: null as any,
};

// Link aliases to avoid duplication
AMBIENT_GRADIENT_PRESETS.warmEditorial = AMBIENT_GRADIENT_PRESETS.homeAmbient;
AMBIENT_GRADIENT_PRESETS.graphiteMetallic = AMBIENT_GRADIENT_PRESETS.garageIndustrial;
AMBIENT_GRADIENT_PRESETS.softLuxury = AMBIENT_GRADIENT_PRESETS.shopLuxury;
AMBIENT_GRADIENT_PRESETS.performanceAccent = AMBIENT_GRADIENT_PRESETS.bookingWarm;
AMBIENT_GRADIENT_PRESETS.deepIndustrial = AMBIENT_GRADIENT_PRESETS.deepAuth;
AMBIENT_GRADIENT_PRESETS.heroCockpit = AMBIENT_GRADIENT_PRESETS.cockpitDark;
