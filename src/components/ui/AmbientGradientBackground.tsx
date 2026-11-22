import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AMBIENT_GRADIENT_PRESETS,
  AmbientPresetKey,
  AmbientRadialField,
} from '@/theme/ambientGradients';

export interface AmbientGradientBackgroundProps {
  children?: React.ReactNode;
  preset?: AmbientPresetKey;
  // Backward compatibility prop alias
  variant?: AmbientPresetKey;
  baseColor?: string;
  radialFields?: AmbientRadialField[];
  hasGlowAccent?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const AmbientGradientBackground: React.FC<AmbientGradientBackgroundProps> = ({
  children,
  preset,
  variant,
  baseColor,
  radialFields,
  hasGlowAccent = false,
  style,
  contentContainerStyle,
}) => {
  const chosenKey: AmbientPresetKey = preset || variant || 'homeAmbient';
  const config = AMBIENT_GRADIENT_PRESETS[chosenKey] || AMBIENT_GRADIENT_PRESETS.homeAmbient;

  const resolvedBaseColor = baseColor || config.baseColor;
  const resolvedRadialFields = radialFields || config.radialFields;
  const linearOverlay = config.linearOverlay;
  const hairlineColor = config.hairlineColor || 'rgba(255, 255, 255, 0.08)';

  return (
    <View style={[styles.container, { backgroundColor: resolvedBaseColor }, style]}>
      {/* Layer 1: Multi-Point SVG Radial Color Fields */}
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        pointerEvents="none"
      >
        <Defs>
          {resolvedRadialFields.map(field => (
            <SvgRadialGradient
              key={field.id}
              id={field.id}
              cx={field.cx}
              cy={field.cy}
              rx={field.rx}
              ry={field.ry}
              fx={field.fx ?? field.cx}
              fy={field.fy ?? field.cy}
              gradientUnits="userSpaceOnUse"
            >
              {field.stops.map((stop, sIdx) => (
                <Stop
                  key={sIdx}
                  offset={stop.offset}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity}
                />
              ))}
            </SvgRadialGradient>
          ))}
        </Defs>

        {/* Render each radial field as a blending layer */}
        {resolvedRadialFields.map(field => (
          <Rect
            key={`rect_${field.id}`}
            width="100%"
            height="100%"
            fill={`url(#${field.id})`}
          />
        ))}
      </Svg>

      {/* Layer 2: Subtle Linear Directional Overlay */}
      {linearOverlay && (
        <LinearGradient
          colors={linearOverlay.colors as [string, string, ...string[]]}
          start={linearOverlay.start}
          end={linearOverlay.end}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}

      {/* Layer 3: Optional Warm Burnt Orange Ambient Glow */}
      {hasGlowAccent && (
        <LinearGradient
          colors={['rgba(217, 107, 58, 0.12)', 'rgba(217, 107, 58, 0.00)']}
          start={{ x: 0.5, y: 0.0 }}
          end={{ x: 0.5, y: 0.4 }}
          style={styles.ambientGlow}
          pointerEvents="none"
        />
      )}

      {/* Layer 4: Architectural Studio Hairline Divider */}
      <View
        style={[styles.technicalHairline, { backgroundColor: hairlineColor }]}
        pointerEvents="none"
      />

      {/* Content Canvas */}
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 340,
  },
  technicalHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  content: {
    flex: 1,
  },
});
