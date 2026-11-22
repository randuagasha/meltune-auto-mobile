import React from 'react';
import {
  AmbientGradientBackground,
  AmbientGradientBackgroundProps,
} from './AmbientGradientBackground';
import { AmbientPresetKey } from '@/theme/ambientGradients';

export type GradientVariant = AmbientPresetKey;

export type GradientBackgroundProps = AmbientGradientBackgroundProps;

export const GradientBackground: React.FC<GradientBackgroundProps> = props => {
  return <AmbientGradientBackground {...props} />;
};

export { AmbientGradientBackground };
