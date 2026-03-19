/**
 * Trotter Design System - Color Palette
 * 
 * A modern, energetic color scheme inspired by running and racing.
 * Primary colors are vibrant and action-oriented, while neutrals provide
 * clean, readable backgrounds and text.
 */

export const colors = {
  // Primary Brand Colors - Energetic & Dynamic
  primary: {
    main: '#FF6B35',      // Vibrant orange-red - energy, action, urgency
    light: '#FF8C61',     // Lighter for hover states
    dark: '#E55A2A',      // Darker for pressed states
    gradient: ['#FF6B35', '#FF8C42'], // Gradient for buttons/accents
  },

  // Secondary Colors - Calm & Professional
  secondary: {
    main: '#4ECDC4',      // Teal - calm, professional, trustworthy
    light: '#7EDDD6',
    dark: '#3AB5AD',
  },

  // Accent Colors - Status & Feedback
  accent: {
    success: '#10B981',    // Green - success states
    warning: '#F59E0B',    // Amber - warnings
    error: '#EF4444',      // Red - errors, stop actions
    info: '#3B82F6',       // Blue - informational
  },

  // Neutral Palette - Text & Backgrounds
  neutral: {
    black: '#1A1A1A',      // Primary text
    gray900: '#2D2D2D',    // Headings
    gray800: '#404040',    // Body text
    gray700: '#525252',    // Secondary text
    gray600: '#737373',    // Tertiary text
    gray500: '#A3A3A3',    // Placeholders
    gray400: '#D4D4D4',    // Borders
    gray300: '#E5E5E5',    // Dividers
    gray200: '#F5F5F5',    // Backgrounds
    gray100: '#FAFAFA',    // Subtle backgrounds
    white: '#FFFFFF',      // Pure white
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',           // Main background
    secondary: '#FAFAFA',         // Card backgrounds, sections
    tertiary: '#F5F5F5',         // Subtle backgrounds
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays
  },

  // Text Colors
  text: {
    primary: '#1A1A1A',    // Main text
    secondary: '#525252',   // Secondary text
    tertiary: '#737373',   // Tertiary text
    inverse: '#FFFFFF',    // Text on dark backgrounds
    disabled: '#A3A3A3',   // Disabled text
  },

  // Border Colors
  border: {
    light: '#E5E5E5',
    medium: '#D4D4D4',
    dark: '#A3A3A3',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
  },
} as const;
