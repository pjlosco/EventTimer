/**
 * Trotter Design System - Spacing
 * 
 * Consistent spacing scale for margins, padding, and gaps.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// Common spacing combinations
export const spacingHelpers = {
  // Padding
  padding: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
    card: spacing.lg,
    screen: spacing.lg,
  },
  // Margins
  margin: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
    section: spacing['2xl'],
  },
  // Gaps
  gap: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  },
} as const;
