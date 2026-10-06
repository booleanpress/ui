/** A colour as hue (0–360), saturation, brightness and alpha (each 0–100). */
export interface Hsva {
  h: number
  s: number
  v: number
  a: number
}

export const BLACK: Hsva = { h: 0, s: 0, v: 0, a: 100 }

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

export function rgbToHsva(r: number, g: number, b: number, a: number): Hsva {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn)
  const delta = max - Math.min(rn, gn, bn)
  let h = 0
  if (delta) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max === 0 ? 0 : (delta / max) * 100, v: max * 100, a }
}

export function hsvaToRgb({ h, s, v }: Hsva): [number, number, number] {
  const sn = s / 100
  const vn = v / 100
  const channel = (n: number) => {
    const k = (n + h / 60) % 6
    return Math.round((vn - vn * sn * Math.max(0, Math.min(k, 4 - k, 1))) * 255)
  }
  return [channel(5), channel(3), channel(1)]
}

/** Reads `#rgb`, `#rgba`, `#rrggbb` or `#rrggbbaa`, with or without the `#`; null when it is not a hex colour. */
export function parseHex(text: string): Hsva | null {
  let hex = text.trim().replace(/^#/, "")
  if (!/^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) return null
  if (hex.length <= 4) hex = [...hex].map((c) => c + c).join("")
  const part = (i: number) => parseInt(hex.slice(i, i + 2), 16)
  return rgbToHsva(part(0), part(2), part(4), hex.length === 8 ? (part(6) / 255) * 100 : 100)
}

/** `#rrggbb`, or `#rrggbbaa` when alpha is on and the colour is not opaque. */
export function toHex(color: Hsva, alpha: boolean): string {
  const hex = (n: number) => n.toString(16).padStart(2, "0")
  const rgb = `#${hsvaToRgb(color).map(hex).join("")}`
  return alpha && Math.round(color.a / 100 * 255) < 255 ? rgb + hex(Math.round((color.a / 100) * 255)) : rgb
}

export const rgbCss = (color: Hsva, a = 100) => {
  const [r, g, b] = hsvaToRgb(color)
  return `rgb(${r} ${g} ${b} / ${a / 100})`
}

/** A grey has no hue of its own: keep the one the person chose, so the hue slider does not jump back to red. */
export const keepHue = (next: Hsva, previous: Hsva): Hsva => (next.s === 0 || next.v === 0 ? { ...next, h: previous.h } : next)

// boolean-ui patch: independent sRGB channel conversion for the picker's editable formats.
export type ColorFormat = "hex" | "rgba" | "hsba" | "hsla" | "oklcha"
export type ColorChannel = "red" | "green" | "blue" | "hue" | "saturation" | "brightness" | "lightness" | "chroma" | "alpha"
export const colorChannels: Record<ColorFormat, readonly ColorChannel[]> = {
  hex: [], rgba: ["red", "green", "blue", "alpha"], hsba: ["hue", "saturation", "brightness", "alpha"],
  hsla: ["hue", "saturation", "lightness", "alpha"], oklcha: ["lightness", "chroma", "hue", "alpha"],
}

function hsl(color: Hsva): [number, number, number] {
  const v = color.v / 100, s = color.s / 100
  const l = v * (1 - s / 2)
  return [color.h, l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l) * 100, l * 100]
}
function fromHsl(h: number, s: number, l: number, a: number): Hsva {
  const light = l / 100, v = light + s / 100 * Math.min(light, 1 - light)
  return { h, s: v === 0 ? 0 : 2 * (1 - light / v) * 100, v: v * 100, a }
}

// OKLab uses the sRGB/D65 conversion matrices defined by CSS Color 4:
// https://www.w3.org/TR/css-color-4/#color-conversion-code
function oklch(color: Hsva): [number, number, number] {
  const [r, g, b] = hsvaToRgb(color).map((c) => c / 255).map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const c = Math.hypot(a, B)
  return [L * 100, c, c < 0.000001 ? color.h : (Math.atan2(B, a) * 180 / Math.PI + 360) % 360]
}
function fromOklch(L: number, C: number, h: number, alpha: number): Hsva {
  const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180)
  const l = (L / 100 + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L / 100 - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L / 100 - 0.0894841775 * a - 1.291485548 * b) ** 3
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
    .map((c) => clamp(c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055, 0, 1) * 255)
  return rgbToHsva(rgb[0], rgb[1], rgb[2], alpha)
}
export function channelRange(channel: ColorChannel, format?: ColorFormat): { max: number; step: number } {
  if (channel === "alpha") return { max: 1, step: 0.01 }
  if (channel === "lightness" && format === "oklcha") return { max: 1, step: 0.001 }
  if (channel === "hue") return { max: 360, step: 1 }
  if (channel === "chroma") return { max: 0.4, step: 0.001 }
  if (["red", "green", "blue"].includes(channel)) return { max: 255, step: 1 }
  return { max: 100, step: 1 }
}
export function channelValue(color: Hsva, channel: ColorChannel, format: ColorFormat): number {
  if (channel === "alpha") return color.a / 100
  if (channel === "red" || channel === "green" || channel === "blue") return hsvaToRgb(color)[["red", "green", "blue"].indexOf(channel)]
  if (channel === "chroma" || (format === "oklcha" && (channel === "lightness" || channel === "hue"))) return oklch(color)[["lightness", "chroma", "hue"].indexOf(channel)] / (channel === "lightness" ? 100 : 1)
  if (format === "hsla" && (channel === "saturation" || channel === "lightness")) return hsl(color)[channel === "saturation" ? 1 : 2]
  return channel === "hue" ? color.h : channel === "saturation" ? color.s : channel === "brightness" ? color.v : hsl(color)[2]
}
export function withChannel(color: Hsva, channel: ColorChannel, value: number, format: ColorFormat): Hsva {
  const next = clamp(value, 0, channelRange(channel, format).max)
  if (channel === "alpha") return { ...color, a: next * 100 }
  if (channel === "red" || channel === "green" || channel === "blue") {
    const rgb = hsvaToRgb(color)
    rgb[["red", "green", "blue"].indexOf(channel)] = next
    return keepHue(rgbToHsva(rgb[0], rgb[1], rgb[2], color.a), color)
  }
  if (format === "oklcha" || channel === "chroma") {
    const channels = oklch(color)
    const index = ["lightness", "chroma", "hue"].indexOf(channel)
    if (index >= 0) { channels[index] = channel === "lightness" ? next * 100 : next; return fromOklch(channels[0], channels[1], channels[2], color.a) }
  }
  if (format === "hsla" || channel === "lightness") {
    const channels = hsl(color)
    const index = ["hue", "saturation", "lightness"].indexOf(channel)
    if (index >= 0) { channels[index] = next; return fromHsl(channels[0], channels[1], channels[2], color.a) }
  }
  return { ...color, [channel === "hue" ? "h" : channel === "saturation" ? "s" : "v"]: next }
}
const rounded = (value: number, digits = 3) => Number(value.toFixed(digits))
export const toOklchCss = (color: Hsva) => {
  const [l, c, h] = oklch(color)
  return `oklch(${rounded(l)}% ${rounded(c, 5)} ${rounded(h)} / ${rounded(color.a / 100)})`
}

/** Hex, rgb(a), hsl(a), hsb(a)/hsv(a), and CSS oklch; stored and submitted in the sRGB gamut. */
export function parseColor(text: string): Hsva | null {
  const hex = parseHex(text)
  if (hex) return hex
  const match = text.trim().match(/^(rgba?|hsla?|hsba?|hsva?|oklch)\(([^)]+)\)$/i)
  if (!match) return null
  const kind = match[1].toLowerCase()
  const parts = match[2].trim().toLowerCase().split(/\s*[,/]\s*|\s+/)
  if (parts.length < 3 || parts.length > 4 || parts.some((p) => !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?(?:%|deg|grad|rad|turn)?$/i.test(p))) return null
  if (parts.some((part) => !Number.isFinite(parseFloat(part)))) return null
  const number = (i: number) => parseFloat(parts[i])
  const percent = (i: number, scale: number) => parts[i].endsWith("%") ? number(i) / 100 * scale : number(i)
  const alpha = parts[3] === undefined ? 100 : clamp(percent(3, 1) * 100, 0, 100)
  const angle = (i: number) => {
    const p = parts[i], n = number(i)
    return ((p.endsWith("turn") ? n * 360 : p.endsWith("grad") ? n * 0.9 : p.endsWith("rad") ? n * 180 / Math.PI : n) % 360 + 360) % 360
  }
  // Units must belong to their channel; malformed CSS must not silently become another colour.
  if (parts.slice(0, 3).some((p, i) => /(?:deg|grad|rad|turn)$/i.test(p) && i !== (kind === "oklch" ? 2 : kind.startsWith("rgb") ? -1 : 0)) || (parts[3] && /[a-z]/i.test(parts[3]))) return null
  if (kind.startsWith("rgb")) return rgbToHsva(clamp(percent(0, 255), 0, 255), clamp(percent(1, 255), 0, 255), clamp(percent(2, 255), 0, 255), alpha)
  if (kind === "oklch") return fromOklch(clamp(percent(0, 1) * 100, 0, 100), Math.max(0, percent(1, 0.4)), angle(2), alpha)
  if (kind.startsWith("hsl")) return fromHsl(angle(0), clamp(number(1), 0, 100), clamp(number(2), 0, 100), alpha)
  return { h: angle(0), s: clamp(number(1), 0, 100), v: clamp(number(2), 0, 100), a: alpha }
}
