# Trotter Design System

## Overview
A modern, energetic design system for Trotter that balances professionalism with the dynamic energy of running and racing.

## Brand Identity

### Name: "Trotter"
- **Meaning**: Playful reference to "trotting along" in running
- **Personality**: Energetic, approachable, professional, reliable
- **Tone**: Friendly but efficient, modern but not flashy

### Logo Concept Suggestions
1. **Running Shoe Silhouette** - Simple, recognizable icon
2. **Abstract Runner** - Stylized figure in motion
3. **Stopwatch/Clock** - Timing-focused icon
4. **Letter "T"** - Stylized with motion lines or gradient

## Color Palette

### Primary Colors
- **Main**: `#FF6B35` (Vibrant Orange-Red)
  - Represents energy, action, urgency
  - Used for primary buttons, active states, timer display
- **Light**: `#FF8C61` - Hover/pressed states
- **Dark**: `#E55A2A` - Pressed states

### Secondary Colors
- **Main**: `#4ECDC4` (Teal)
  - Represents calm, professionalism, trust
  - Used for secondary actions, badges, accents

### Accent Colors
- **Success**: `#10B981` (Green) - Success states, confirmations
- **Warning**: `#F59E0B` (Amber) - Warnings, cautions
- **Error**: `#EF4444` (Red) - Errors, stop actions, deletions
- **Info**: `#3B82F6` (Blue) - Informational messages

### Neutral Palette
- **Text**: `#1A1A1A` (Primary), `#525252` (Secondary), `#737373` (Tertiary)
- **Backgrounds**: `#FFFFFF` (Primary), `#FAFAFA` (Secondary), `#F5F5F5` (Tertiary)
- **Borders**: `#E5E5E5` (Light), `#D4D4D4` (Medium)

## Typography

### Font Weights
- **Regular (400)**: Body text
- **Semibold (600)**: Labels, buttons, emphasis
- **Bold (700)**: Headings, timer display, important text

### Type Scale
- **Display**: 56px, 48px, 40px - Timer, hero text
- **Headings**: 32px, 24px, 20px, 18px - Section titles
- **Body**: 17px, 16px, 14px - Content text
- **Labels**: 16px, 14px, 12px - Form labels, buttons
- **Caption**: 12px - Metadata, timestamps

## Spacing

Consistent 4px base unit:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **2xl**: 24px
- **3xl**: 32px
- **4xl**: 40px
- **5xl**: 48px
- **6xl**: 64px

## Component Styles

### Cards
- **Background**: White
- **Border Radius**: 16px
- **Shadow**: Subtle elevation (0.05 opacity)
- **Padding**: 16px-20px

### Buttons
- **Primary**: Orange-red gradient, white text, 12px radius
- **Secondary**: Teal background, white text
- **Tertiary**: Outlined, transparent background
- **Padding**: 14px vertical, 24px horizontal

### Inputs
- **Border**: 1px, light gray
- **Border Radius**: 8px
- **Padding**: 12px
- **Focus**: Orange-red border

### Badges/Tags
- **Background**: Light teal (`#E8F4F8`)
- **Text**: Teal (`#4ECDC4`)
- **Border Radius**: 6px
- **Padding**: 4px-8px

## Design Principles

1. **Clarity First**: Information hierarchy is clear and scannable
2. **Energy & Motion**: Use gradients, subtle animations, and dynamic colors
3. **Professional Polish**: Clean spacing, consistent alignment, proper shadows
4. **Accessibility**: High contrast ratios, readable font sizes, touch-friendly targets (min 44x44px)
5. **Mobile-First**: Optimized for one-handed use, thumb-friendly zones

## Visual Enhancements

### Gradients
- Use subtle gradients on primary buttons and timer display
- Orange-red gradient: `#FF6B35` → `#FF8C42`

### Shadows
- **Light**: Cards, subtle elevation
- **Medium**: Modals, important cards
- **Dark**: Overlays, emphasis

### Borders
- **Light**: Dividers, subtle separation
- **Medium**: Input fields, cards
- **Dark**: Focus states, emphasis

## Implementation Notes

- All design tokens are exported from `/trotter/theme/`
- Use theme values instead of hardcoded colors/sizes
- Maintain consistency across all screens
- Test on both light and dark mode (future consideration)
