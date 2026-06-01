import { createTheme, MantineColorsTuple } from '@mantine/core';

// Monolithic Clarity design tokens
// All components MUST import from here instead of hardcoding values.
export const tokens = {
  colors: {
    background: '#131313',
    surface: '#1C1C1C',
    elevated: '#2D2D2D',
    surfaceContainer: '#201f1f',
    surfaceContainerHigh: '#2a2a2a',
    surfaceContainerHighest: '#353534',
    primaryText: '#F5F5F5',
    secondaryText: '#999999',
    accent: '#FFFFFF',
    outline: '#8e9192',
    outlineVariant: '#444748',
    onPrimary: '#2f3131',
    error: '#ffb4ab',
    errorContainer: '#93000a',
    favorite: '#eab308',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  spacing: {
    unit: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '48px',
  },
  barcode: {
    background: '#FFFFFF',
    lineColor: '#000000',
  },
  cardAccents: [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#6b7280', '#1C1C1C',
  ],
  cardAccentDefault: '#3b82f6',
} as const;

// Monolithic Clarity grayscale as a Mantine color tuple
const gray: MantineColorsTuple = [
  '#F5F5F5', // 0 - Primary text / off-white
  '#e5e2e1', // 1 - on-surface
  '#c4c7c8', // 2 - on-surface-variant
  '#999999', // 3 - secondary text
  '#8e9192', // 4 - outline
  '#474747', // 5 - secondary-container
  '#444748', // 6 - outline-variant
  '#2D2D2D', // 7 - slate gray / elevated
  '#1C1C1C', // 8 - graphite / surface
  '#131313', // 9 - charcoal / background
];

export const theme = createTheme({
  primaryColor: 'gray',
  colors: {
    gray,
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '600',
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  defaultRadius: 'sm',
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '48px',
  },
  other: {
    colors: tokens.colors,
  },
});
