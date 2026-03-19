/**
 * Trotter Design System - Typography
 * 
 * Modern, readable type scale optimized for mobile screens.
 */

export const typography = {
  // Display - Large, attention-grabbing
  display: {
    large: {
      fontSize: 56,
      fontWeight: '700' as const,
      lineHeight: 64,
      letterSpacing: -0.5,
    },
    medium: {
      fontSize: 48,
      fontWeight: '700' as const,
      lineHeight: 56,
      letterSpacing: -0.5,
    },
    small: {
      fontSize: 40,
      fontWeight: '700' as const,
      lineHeight: 48,
    },
  },

  // Headings
  heading: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.3,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
      letterSpacing: -0.2,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
  },

  // Body Text
  body: {
    large: {
      fontSize: 17,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    medium: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    small: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },

  // Labels & Captions
  label: {
    large: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    medium: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
    },
  },

  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },

  // Special - Timer Display
  timer: {
    fontSize: 56,
    fontWeight: '700' as const,
    lineHeight: 64,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'] as const,
  },
} as const;
