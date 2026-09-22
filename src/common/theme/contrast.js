/**
 * Colour maths used by the theme layer.
 *
 * The point of this file is that we never hand-pick a text colour for a
 * background. We compute it, so a dark surface always gets a light font and a
 * light surface always gets a dark one - and the pair is guaranteed to clear a
 * WCAG contrast threshold instead of just "looking about right".
 *
 * No dependencies on purpose: this must stay usable from plain JS, tests and
 * both the Procurement and CRM apps.
 */

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGB = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.%]+))?\s*\)$/i

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** Parse `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()` and `rgba()` into channels. */
export function parseColor(input) {
  if (typeof input !== 'string') return null
  const value = input.trim()

  const hex = value.match(HEX)
  if (hex) {
    let raw = hex[1]
    if (raw.length === 3 || raw.length === 4) {
      raw = raw
        .split('')
        .map((char) => char + char)
        .join('')
    }
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
      a: raw.length === 8 ? parseInt(raw.slice(6, 8), 16) / 255 : 1,
    }
  }

  const rgb = value.match(RGB)
  if (rgb) {
    const alpha = rgb[4]
    return {
      r: clamp(Number(rgb[1]), 0, 255),
      g: clamp(Number(rgb[2]), 0, 255),
      b: clamp(Number(rgb[3]), 0, 255),
      a: alpha === undefined ? 1 : clamp(alpha.endsWith('%') ? Number(alpha.slice(0, -1)) / 100 : Number(alpha), 0, 1),
    }
  }

  return null
}

/** Same colour, different opacity. Returns an `rgba()` string. */
export function withAlpha(color, alpha) {
  const parsed = parseColor(color)
  if (!parsed) return color
  return `rgba(${Math.round(parsed.r)}, ${Math.round(parsed.g)}, ${Math.round(parsed.b)}, ${clamp(alpha, 0, 1)})`
}

/** Blend two colours. `weight` is how much of `to` ends up in the result. */
export function mix(from, to, weight = 0.5) {
  const a = parseColor(from)
  const b = parseColor(to)
  if (!a || !b) return from
  const w = clamp(weight, 0, 1)
  const channel = (x, y) => Math.round(x + (y - x) * w)
  return rgbToHex(channel(a.r, b.r), channel(a.g, b.g), channel(a.b, b.b))
}

export function rgbToHex(r, g, b) {
  const pair = (value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')
  return `#${pair(r)}${pair(g)}${pair(b)}`
}

/** Flatten a translucent colour onto an opaque one, so we can measure it. */
export function flatten(color, backdrop = '#ffffff') {
  const parsed = parseColor(color)
  if (!parsed) return color
  if (parsed.a >= 1) return rgbToHex(parsed.r, parsed.g, parsed.b)
  const base = parseColor(backdrop) || { r: 255, g: 255, b: 255 }
  return rgbToHex(
    parsed.r * parsed.a + base.r * (1 - parsed.a),
    parsed.g * parsed.a + base.g * (1 - parsed.a),
    parsed.b * parsed.a + base.b * (1 - parsed.a),
  )
}

const toLinear = (channel) => {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function luminance(color, backdrop = '#ffffff') {
  const parsed = parseColor(flatten(color, backdrop))
  if (!parsed) return 0
  return 0.2126 * toLinear(parsed.r) + 0.7152 * toLinear(parsed.g) + 0.0722 * toLinear(parsed.b)
}

/** WCAG contrast ratio between two colours: 1 (identical) to 21 (black on white). */
export function contrastRatio(foreground, background) {
  const a = luminance(foreground, background)
  const b = luminance(background)
  const [light, dark] = a > b ? [a, b] : [b, a]
  return (light + 0.05) / (dark + 0.05)
}

export function isDarkColor(color, backdrop = '#ffffff') {
  return luminance(color, backdrop) < 0.45
}

/**
 * The core rule of this theme system: pick the text colour that actually reads
 * on `background`. Dark surface -> light ink, light surface -> dark ink.
 */
export function readableTextOn(background, options = {}) {
  const { light = '#ffffff', dark = '#0f172a' } = options
  return contrastRatio(light, background) >= contrastRatio(dark, background) ? light : dark
}

const LEVELS = {
  AA: { normal: 4.5, large: 3 },
  AAA: { normal: 7, large: 4.5 },
}

/** `size` is "large" for >=18.66px bold or >=24px text, per WCAG. */
export function meetsContrast(foreground, background, level = 'AA', size = 'normal') {
  const required = (LEVELS[level] || LEVELS.AA)[size] ?? LEVELS.AA.normal
  return contrastRatio(foreground, background) >= required
}

/**
 * Nudge a colour until it clears `minRatio` against `background`. Used for
 * "soft" badge/link text in dark mode, where the brand hue on its own is
 * usually too dim to read.
 */
export function ensureContrast(color, background, minRatio = 4.5) {
  if (contrastRatio(color, background) >= minRatio) return color
  const target = isDarkColor(background) ? '#ffffff' : '#000000'
  let candidate = color
  for (let step = 1; step <= 20; step += 1) {
    candidate = mix(color, target, step / 20)
    if (contrastRatio(candidate, background) >= minRatio) return candidate
  }
  return target
}
