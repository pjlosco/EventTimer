/**
 * Trotter Design System
 * 
 * Central export for all design tokens.
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing, spacingHelpers } from './spacing';

export { colors } from './colors';
export { typography } from './typography';
export { spacing, spacingHelpers } from './spacing';

// Re-export commonly used values for convenience
export const theme = {
  colors,
  typography,
  spacing,
  spacingHelpers,
} as const;
