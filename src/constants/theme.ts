/**
 * LocalFix Partner App Theme & Design Tokens
 * 
 * Palette Roles:
 * - Primary (#0C1B33 - Deep Navy): Authority, core data, primary titles, high-emphasis elements.
 * - Secondary / Accent (#F39E25 - Warm Amber Orange): Focal driver for actions, accepted states, CTAs, step highlights.
 * - Background (#F8FAFC - Soft Gray): Glare-reducing canvas color for outdoor / mobile van usage.
 * - Surface / Element Canvas (#FFFFFF - Pure White): Work cards, sheet backdrops, and active inputs.
 * - Text Secondary (#64748B - Slate Gray): Supporting metadata, timestamps, sub-labels, borders.
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Palette = {
  // Core Required Palette Roles
  primary: '#0C1B33', // Deep Navy
  secondary: '#F39E25', // Warm Amber Orange
  accent: '#F39E25', // Alias for secondary
  background: '#F8FAFC', // Soft Gray
  surface: '#FFFFFF', // Pure White
  textSecondary: '#64748B', // Slate Gray

  // Extended UI Tokens
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Status & Feedback Tokens
  success: '#10B981',
  successBg: '#ECFDF5',
  successText: '#065F46',
  successBorder: '#BBF7D0',

  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningText: '#92400E',
  warningBorder: '#FEF3C7',

  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  dangerText: '#DC2626',
  dangerBorder: '#FCA5A5',

  info: '#2563EB',
  infoBg: '#EFF6FF',
  infoText: '#1E40AF',
  infoBorder: '#BFDBFE',
} as const;

export const Colors = {
  light: {
    primary: Palette.primary,
    secondary: Palette.secondary,
    accent: Palette.accent,
    background: Palette.background,
    surface: Palette.surface,
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E2E8F0',
    text: Palette.primary,
    textSecondary: Palette.textSecondary,
    border: Palette.border,
  },
  dark: {
    primary: '#FFFFFF',
    secondary: Palette.secondary,
    accent: Palette.accent,
    background: '#070F1E',
    surface: Palette.primary,
    backgroundElement: '#142542',
    backgroundSelected: '#1C335A',
    text: '#FFFFFF',
    textSecondary: '#94A3B8',
    border: '#1E293B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display, system-ui, -apple-system, sans-serif)',
    serif: 'var(--font-serif, serif)',
    rounded: 'var(--font-rounded, system-ui, sans-serif)',
    mono: 'var(--font-mono, monospace)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
