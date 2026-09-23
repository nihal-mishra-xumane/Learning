/**
 * Public entry point for the theme system.
 *
 * Import from here, never from the individual files:
 *   import { ThemeProvider, useTheme, createTheme } from '@/common/theme'
 */

import './theme.css'

export { ThemeProvider, useTheme, ThemeContext, THEME_MODES } from './ThemeProvider'
export { default as ThemeToggle } from './ThemeToggle'

export {
  createTheme,
  resolveTheme,
  normalizeSettings,
  sanitizeImageUrl,
  generateRamp,
  buildFontSizes,
  buildRadius,
  deepMerge,
  defaultThemeConfig,
  defaultSettings,
  SETTING_LIMITS,
  colorPresets,
  contentWidths,
  fontStacks,
  palette,
  typography,
  spacing,
  radius,
  density,
  size,
  motion,
  zIndex,
  breakpoint,
} from './tokens'

export { toCssVariables, toCssText, applyCssVariables, DEFAULT_PREFIX } from './cssVariables'

export {
  contrastRatio,
  ensureContrast,
  isDarkColor,
  luminance,
  meetsContrast,
  mix,
  parseColor,
  readableTextOn,
  rgbToHex,
  withAlpha,
} from './contrast'
