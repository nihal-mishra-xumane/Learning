import { ensureContrast, mix, readableTextOn, withAlpha } from './contrast'

/**
 * The single source of truth for the design system.
 *
 * Two layers:
 *   config   - what the product ships with (brand ramps, scales). Set once per
 *              app: Procurement and CRM each pass their own to ThemeProvider.
 *   settings - what a user can change at runtime from the Theme Config page.
 *              Small, flat and serialisable, so it can be saved, exported or
 *              stored against a user profile.
 *
 * `resolveTheme(config, { mode, settings })` turns both into the flat token set
 * the app consumes. Nothing else in the app should contain a literal colour,
 * font size, radius or shadow.
 */

/* ------------------------------------------------------------------ palette */

export const palette = {
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
    1000: '#000000',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
}

/**
 * Build a full 50-950 ramp from one colour, so the colour picker only has to
 * ask the user for a single value. The input is treated as the 600 step, which
 * is what light mode uses for solid fills.
 */
export function generateRamp(base) {
  const tint = (weight) => mix(base, '#ffffff', weight)
  const shade = (weight) => mix(base, '#000000', weight)
  return {
    50: tint(0.95),
    100: tint(0.9),
    200: tint(0.8),
    300: tint(0.65),
    400: tint(0.45),
    500: tint(0.22),
    600: base,
    700: shade(0.18),
    800: shade(0.34),
    900: shade(0.48),
    950: shade(0.66),
  }
}

/* -------------------------------------------------------------- typography */

/**
 * Font choices offered by the config page. Every stack ends in a system font,
 * so nothing depends on a webfont being downloaded.
 */
export const fontStacks = {
  system: {
    label: 'System default',
    value: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  inter: { label: 'Inter', value: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" },
  roboto: { label: 'Roboto', value: "'Roboto', system-ui, 'Segoe UI', Arial, sans-serif" },
  georgia: { label: 'Georgia', value: "Georgia, 'Times New Roman', Times, serif" },
  mono: { label: 'Monospace', value: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace" },
}

export const typography = {
  family: {
    sans: fontStacks.inter.value,
    mono: fontStacks.mono.value,
  },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  lineHeight: { tight: '1.25', snug: '1.375', normal: '1.5', relaxed: '1.625' },
  letterSpacing: { tight: '-0.01em', normal: '0', wide: '0.02em', wider: '0.06em' },
}

/**
 * Type scale derived from one base size, so the font-size control moves the
 * whole system in proportion instead of one element at a time.
 * A base of 14 reproduces the default scale exactly.
 */
export function buildFontSizes(base) {
  const rem = (px) => `${Math.round((px / 16) * 10000) / 10000}rem`
  return {
    xs: rem(base - 2),
    sm: rem(base - 1),
    md: rem(base),
    lg: rem(base + 2),
    xl: rem(base + 4),
    '2xl': rem(base + 8),
    '3xl': rem(base + 14),
    '4xl': rem(base + 22),
  }
}

/* ----------------------------------------------------------------- spacing */

// 4px base grid. Keys are the step on the scale, not the pixel value.
export const spacing = {
  0: '0px',
  1: '2px',
  2: '4px',
  3: '8px',
  4: '12px',
  5: '16px',
  6: '20px',
  7: '24px',
  8: '32px',
  9: '40px',
  10: '48px',
  11: '64px',
  12: '80px',
}

/**
 * Radius scale derived from one corner value. A base of 8 reproduces the
 * default scale, and 0 gives fully square corners throughout.
 */
export function buildRadius(base) {
  const step = (factor) => `${Math.round(base * factor)}px`
  return {
    none: '0px',
    xs: step(0.375),
    sm: step(0.625),
    md: step(1),
    lg: step(1.5),
    xl: step(2),
    pill: '999px',
    circle: '50%',
  }
}

export const radius = buildRadius(8)

/** Control sizing per density. Drives control heights, padding and row height. */
export const density = {
  compact: {
    control: { sm: '26px', md: '32px', lg: '38px' },
    controlPadX: { sm: '8px', md: '12px', lg: '16px' },
    rowPadY: '8px',
    sectionGap: '16px',
  },
  comfortable: {
    control: { sm: '32px', md: '40px', lg: '48px' },
    controlPadX: { sm: '12px', md: '16px', lg: '20px' },
    rowPadY: '12px',
    sectionGap: '24px',
  },
  spacious: {
    control: { sm: '36px', md: '46px', lg: '54px' },
    controlPadX: { sm: '16px', md: '20px', lg: '26px' },
    rowPadY: '16px',
    sectionGap: '32px',
  },
}

/** Content width presets for the layout control. */
export const contentWidths = {
  narrow: { label: 'Narrow', value: '1120px' },
  wide: { label: 'Wide', value: '1440px' },
  full: { label: 'Full width', value: '100%' },
}

export const size = {
  icon: { sm: '14px', md: '16px', lg: '20px' },
  // Minimum hit area for coarse pointers (WCAG 2.5.5).
  touchTarget: '44px',
  sidebar: '240px',
  sidebarCollapsed: '64px',
  header: '56px',
  contentMax: contentWidths.wide.value,
  fieldMax: '480px',
}

export const motion = {
  duration: { instant: '0ms', fast: '120ms', normal: '200ms', slow: '320ms' },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    entrance: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
}

export const zIndex = {
  base: 0,
  sticky: 100,
  header: 200,
  drawer: 300,
  overlay: 400,
  modal: 500,
  popover: 600,
  toast: 700,
}

// Kept in JS only: CSS custom properties cannot be used inside media queries.
export const breakpoint = { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }

/* ------------------------------------------------------- runtime settings */

/**
 * Everything the Theme Config page can change. Flat and JSON-safe on purpose:
 * this is what gets persisted, exported and imported.
 * `null` means "derive it" - the theme works these out from the other values.
 */
export const defaultSettings = {
  mode: 'system', // light | dark | system
  primaryColor: palette.brand[600],
  accentColor: palette.accent[600],
  fontFamily: 'inter', // key of fontStacks
  fontSize: 14, // base size in px, drives the whole scale
  headingWeight: '600',
  bodyWeight: '400',
  buttonStyle: 'filled', // filled | outlined
  buttonTextColor: null, // null = computed for contrast
  backgroundColor: null, // null = neutral ramp
  surfaceColor: null, // card / panel colour
  backgroundImage: '',
  borderColor: null,
  borderWidth: 1,
  radius: 8,
  density: 'comfortable', // compact | comfortable | spacious
  sidebarPosition: 'left', // left | right
  contentWidth: 'wide', // narrow | wide | full
}

export const SETTING_LIMITS = {
  fontSize: { min: 12, max: 20 },
  radius: { min: 0, max: 24 },
  borderWidth: { min: 0, max: 4 },
}

const MODES = ['light', 'dark', 'system']

/**
 * A background image URL ends up inside a CSS `url()`, so it has to be
 * sanitised: only http(s) and data-image URLs, and the value is encoded so it
 * cannot break out of the declaration.
 */
export function sanitizeImageUrl(input) {
  if (typeof input !== 'string') return ''
  const value = input.trim()
  if (!value) return ''
  if (!/^(https?:\/\/|data:image\/)/i.test(value)) return ''
  return encodeURI(value).replace(/["'()\\]/g, encodeURIComponent)
}

const clampNumber = (value, { min, max }, fallback) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}
const oneOf = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback)
const colorOr = (value, fallback) => (typeof value === 'string' && value.trim() ? value.trim() : fallback)

/**
 * Coerce anything into a usable settings object. Used on every read, so a
 * corrupted localStorage entry or a hand-edited import file degrades to the
 * defaults instead of breaking the app.
 */
export function normalizeSettings(input = {}) {
  const raw = input && typeof input === 'object' ? input : {}
  return {
    ...defaultSettings,
    ...raw,
    mode: oneOf(raw.mode, MODES, defaultSettings.mode),
    primaryColor: colorOr(raw.primaryColor, defaultSettings.primaryColor),
    accentColor: colorOr(raw.accentColor, defaultSettings.accentColor),
    fontFamily: oneOf(raw.fontFamily, Object.keys(fontStacks), defaultSettings.fontFamily),
    fontSize: clampNumber(raw.fontSize, SETTING_LIMITS.fontSize, defaultSettings.fontSize),
    headingWeight: oneOf(String(raw.headingWeight), ['400', '500', '600', '700'], defaultSettings.headingWeight),
    bodyWeight: oneOf(String(raw.bodyWeight), ['300', '400', '500'], defaultSettings.bodyWeight),
    buttonStyle: oneOf(raw.buttonStyle, ['filled', 'outlined'], defaultSettings.buttonStyle),
    buttonTextColor: colorOr(raw.buttonTextColor, null),
    backgroundColor: colorOr(raw.backgroundColor, null),
    surfaceColor: colorOr(raw.surfaceColor, null),
    backgroundImage: typeof raw.backgroundImage === 'string' ? raw.backgroundImage.trim() : '',
    borderColor: colorOr(raw.borderColor, null),
    borderWidth: clampNumber(raw.borderWidth, SETTING_LIMITS.borderWidth, defaultSettings.borderWidth),
    radius: clampNumber(raw.radius, SETTING_LIMITS.radius, defaultSettings.radius),
    density: oneOf(raw.density, Object.keys(density), defaultSettings.density),
    sidebarPosition: oneOf(raw.sidebarPosition, ['left', 'right'], defaultSettings.sidebarPosition),
    contentWidth: oneOf(raw.contentWidth, Object.keys(contentWidths), defaultSettings.contentWidth),
  }
}

/* --------------------------------------------------------------- semantics */

function buildShadows(mode, ink) {
  // Dark surfaces swallow soft shadows, so they get a deeper, tighter stack.
  const strength = mode === 'dark' ? 1.9 : 1
  const shade = (y, blur, alpha) => `0 ${y} ${blur} ${withAlpha(ink, Math.min(alpha * strength, 0.7))}`
  return {
    none: 'none',
    xs: shade('1px', '2px', 0.06),
    sm: `${shade('1px', '2px', 0.06)}, ${shade('2px', '4px', 0.06)}`,
    md: `${shade('2px', '4px', 0.07)}, ${shade('4px', '10px', 0.08)}`,
    lg: `${shade('4px', '8px', 0.08)}, ${shade('10px', '24px', 0.1)}`,
    xl: `${shade('8px', '16px', 0.1)}, ${shade('20px', '48px', 0.14)}`,
  }
}

/**
 * Build one intent (primary / success / danger ...) for a given mode.
 *
 * `onSolid` and `softText` are computed, never authored. That is what keeps a
 * button label readable after a user picks pale yellow in the colour picker.
 */
function buildIntent(ramp, mode, surface, darkInk) {
  const isDark = mode === 'dark'
  const solid = isDark ? ramp[500] : ramp[600]
  const softSurface = isDark ? mix(surface, ramp[400], 0.16) : mix(surface, ramp[300], 0.22)

  return {
    solid,
    hover: isDark ? ramp[400] : ramp[700],
    active: isDark ? ramp[300] : ramp[800],
    onSolid: readableTextOn(solid, { light: '#ffffff', dark: darkInk }),
    soft: softSurface,
    softHover: isDark ? mix(surface, ramp[400], 0.24) : mix(surface, ramp[300], 0.34),
    softText: ensureContrast(isDark ? ramp[300] : ramp[700], softSurface, 4.5),
    border: isDark ? withAlpha(ramp[400], 0.4) : ramp[200],
    ring: withAlpha(isDark ? ramp[400] : ramp[500], 0.45),
  }
}

function buildColors(mode, p, settings) {
  const isDark = mode === 'dark'
  const n = p.neutral

  // A user-chosen surface wins; otherwise the neutral ramp supplies it.
  const surface = settings.surfaceColor || (isDark ? n[900] : n[0])
  const canvas = settings.backgroundColor || (isDark ? n[950] : n[50])

  // Ink is chosen by measuring it against the surface, so "dark theme -> light
  // font" holds for a custom surface colour too, not just the built-in ones.
  const inkPrimary = readableTextOn(surface, { light: n[50], dark: n[900] })
  const inkOnCanvas = readableTextOn(canvas, { light: n[50], dark: n[900] })
  const inkInverse = readableTextOn(inkPrimary, { light: n[50], dark: n[950] })

  // Surfaces and borders are blends of the surface and its ink, so every
  // derived shade stays in step with a custom background.
  const blend = (weight) => mix(surface, inkPrimary, weight)
  const borderBase = settings.borderColor

  const primary = buildIntent(p.brand, mode, surface, n[950])
  const secondary = buildIntent(p.accent, mode, surface, n[950])

  return {
    bg: {
      canvas,
      surface,
      surfaceAlt: blend(0.05),
      sunken: blend(0.07),
      raised: isDark ? blend(0.06) : surface,
      hover: withAlpha(inkPrimary, isDark ? 0.08 : 0.04),
      active: withAlpha(inkPrimary, isDark ? 0.13 : 0.08),
      selected: primary.soft,
      disabled: blend(0.07),
      overlay: withAlpha(isDark ? n[1000] : n[900], isDark ? 0.7 : 0.5),
      skeleton: blend(0.12),
    },
    border: {
      subtle: borderBase || blend(0.12),
      default: borderBase || blend(0.22),
      strong: borderBase ? mix(borderBase, inkPrimary, 0.25) : blend(0.38),
      focus: primary.solid,
    },
    text: {
      primary: inkPrimary,
      // ensureContrast guarantees AA even when the surface is user-chosen.
      secondary: ensureContrast(blend(0.72), surface, 4.5),
      muted: ensureContrast(blend(0.58), surface, 4.5),
      disabled: blend(0.38),
      placeholder: blend(0.45),
      inverse: inkInverse,
      onCanvas: inkOnCanvas,
      link: primary.softText,
      linkHover: isDark ? p.brand[200] : p.brand[800],
    },
    primary,
    secondary,
    status: {
      success: buildIntent(p.success, mode, surface, n[950]),
      warning: buildIntent(p.warning, mode, surface, n[950]),
      danger: buildIntent(p.danger, mode, surface, n[950]),
      info: buildIntent(p.info, mode, surface, n[950]),
      neutral: {
        solid: blend(0.55),
        hover: blend(0.65),
        active: blend(0.75),
        onSolid: readableTextOn(blend(0.55), { light: '#ffffff', dark: n[950] }),
        soft: blend(0.07),
        softHover: blend(0.12),
        softText: ensureContrast(blend(0.72), blend(0.07), 4.5),
        border: blend(0.16),
        ring: withAlpha(inkPrimary, 0.3),
      },
    },
  }
}

/* ------------------------------------------------------- config + resolver */

export const defaultThemeConfig = {
  name: 'base',
  palette,
  typography,
  spacing,
  radius,
  borderWidth: { hairline: '1px', thick: '2px' },
  density,
  size,
  motion,
  zIndex,
  breakpoint,
}

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

/** Recursive merge used for theme overrides. Later values win. */
export function deepMerge(base, override) {
  if (!isPlainObject(override)) return override === undefined ? base : override
  const result = { ...base }
  for (const key of Object.keys(override)) {
    result[key] = isPlainObject(base?.[key]) ? deepMerge(base[key], override[key]) : override[key]
  }
  return result
}

/**
 * Create a theme config. This is the per-app seam: CRM ships its own brand
 * ramp without a single component changing.
 *
 *   const crmTheme = createTheme({ name: 'crm', palette: { brand: { 600: '#7c3aed' } } })
 */
export function createTheme(overrides = {}) {
  return deepMerge(defaultThemeConfig, overrides)
}

/** Turn a config plus the user's settings into the flat token set. */
export function resolveTheme(config = defaultThemeConfig, options = {}) {
  const settings = normalizeSettings({
    ...options.settings,
    // Back-compat: callers that still pass a bare density keep working.
    ...(options.density ? { density: options.density } : {}),
  })
  const mode = options.mode === 'dark' ? 'dark' : 'light'

  // A picked colour replaces the shipped ramp; an untouched one keeps it, so
  // the hand-tuned defaults are not thrown away for no reason.
  const activePalette = {
    ...config.palette,
    brand:
      settings.primaryColor === defaultSettings.primaryColor
        ? config.palette.brand
        : generateRamp(settings.primaryColor),
    accent:
      settings.accentColor === defaultSettings.accentColor
        ? config.palette.accent
        : generateRamp(settings.accentColor),
  }

  const color = buildColors(mode, activePalette, settings)
  const densityKey = config.density[settings.density] ? settings.density : 'comfortable'
  const buttonText = settings.buttonTextColor || color.primary.onSolid

  return {
    name: config.name,
    mode,
    density: densityKey,
    settings,
    color: {
      ...color,
      button: {
        text: buttonText,
        // Outlined buttons sit on the surface, so their label needs to read
        // against that instead of against the fill.
        outlineText: settings.buttonTextColor
          ? ensureContrast(settings.buttonTextColor, color.bg.surface, 4.5)
          : color.primary.softText,
      },
    },
    font: {
      ...config.typography,
      family: { ...config.typography.family, sans: fontStacks[settings.fontFamily].value },
      size: buildFontSizes(settings.fontSize),
      weight: {
        ...config.typography.weight,
        regular: settings.bodyWeight,
        semibold: settings.headingWeight,
      },
    },
    background: {
      image: sanitizeImageUrl(settings.backgroundImage)
        ? `url("${sanitizeImageUrl(settings.backgroundImage)}")`
        : 'none',
    },
    space: config.spacing,
    radius: buildRadius(settings.radius),
    borderWidth: {
      hairline: `${settings.borderWidth}px`,
      thick: `${Math.max(settings.borderWidth * 2, 1)}px`,
    },
    size: {
      ...config.size,
      ...config.density[densityKey],
      contentMax: contentWidths[settings.contentWidth].value,
    },
    shadow: {
      ...buildShadows(mode, mode === 'dark' ? '#000000' : color.text.primary),
      // A visible focus ring is non-negotiable, so it ships as a token.
      focus: `0 0 0 2px ${color.bg.surface}, 0 0 0 4px ${color.border.focus}`,
    },
    motion: config.motion,
    zIndex: config.zIndex,
    breakpoint: config.breakpoint,
  }
}

/**
 * Swatches offered by the colour pickers. Literal hexes belong in this file -
 * they are the palette, not styling decisions made inside a component.
 */
export const colorPresets = {
  primary: [
    palette.brand[600],
    '#4f46e5',
    '#7c3aed',
    '#db2777',
    '#dc2626',
    '#ea580c',
    '#0d9488',
    '#059669',
  ],
  accent: [palette.accent[600], '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9', '#84cc16'],
}
