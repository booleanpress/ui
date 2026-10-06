// The one byte-size formatter of the package: FileUpload's list, Chat's attachments and the Format component write sizes
// with it, so a size reads the same everywhere.

/**
 * The steps a size takes: by 1,000 with the symbols B, KB, MB, GB (`decimal`), or by 1,024 with B, KiB, MiB, GiB
 * (`binary`).
 */
export type ByteUnits = "decimal" | "binary"

/** The short symbol of each step, the same in every language. */
export const BYTE_SYMBOLS: Record<ByteUnits, readonly string[]> = {
  decimal: ["B", "KB", "MB", "GB", "TB", "PB"],
  binary: ["B", "KiB", "MiB", "GiB", "TiB", "PiB"],
}

/** The `Intl` unit of each step, for a size written in the locale's own words. */
export const BYTE_INTL_UNITS = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"] as const

/**
 * A byte count in its unit: `size` (its sign kept), `step` (0 for bytes, 1 for kilo, up to 5 for peta) and the most
 * decimals to show (none for bytes). A size that would round up to the next step ("1,000 KB") moves to it ("1 MB").
 */
export function scaleBytes(
  value: number,
  { units = "decimal", maximumFractionDigits = 1 }: { units?: ByteUnits; maximumFractionDigits?: number } = {}
): { size: number; step: number; fractionDigits: number } {
  const base = units === "binary" ? 1024 : 1000
  const last = BYTE_INTL_UNITS.length - 1
  let size = Math.abs(value)
  let step = 0
  while (size >= base && step < last) {
    size /= base
    step += 1
  }
  if (step > 0 && step < last && Number(size.toFixed(maximumFractionDigits)) >= base) {
    size /= base
    step += 1
  }
  return { size: value < 0 ? -size : size, step, fractionDigits: step === 0 ? 0 : maximumFractionDigits }
}

/**
 * Writes the number of `format` with `unit` in place of the locale's unit, so the locale keeps its digits, separators,
 * spacing and order ("1,5 MB" in German, "١٫٥ MB" in Egyptian Arabic).
 */
export function withUnitSymbol(format: Intl.NumberFormat, value: number, unit: string): string {
  return format
    .formatToParts(value)
    .map((part) => (part.type === "unit" ? unit : part.value))
    .join("")
}

/**
 * A size in bytes with a short symbol, its number in the locale: `formatByteSize(138)` is "138 B",
 * `formatByteSize(1_500_000, { locale: "de-DE" })` "1,5 MB", `formatByteSize(1_572_864, { units: "binary" })` "1.5 MiB".
 * A value that is not a finite number gives an empty string.
 */
export function formatByteSize(
  value: number,
  {
    locale,
    units = "decimal",
    maximumFractionDigits = 1,
  }: { locale?: string; units?: ByteUnits; maximumFractionDigits?: number } = {}
): string {
  if (!Number.isFinite(value)) return ""
  const { size, step, fractionDigits } = scaleBytes(value, { units, maximumFractionDigits })
  const format = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: BYTE_INTL_UNITS[step],
    unitDisplay: "short",
    maximumFractionDigits: fractionDigits,
  })
  return withUnitSymbol(format, size, BYTE_SYMBOLS[units][step])
}

/**
 * A byte count as a short size in steps of 1,000, its number in the locale's digits and separators:
 * `formatFileSize(138, "en")` is "138 B", `formatFileSize(1_500_000, "de-DE")` "1,5 MB". A negative or missing size is 0.
 * `@booleanpress/ui/file-upload` exports it.
 *
 * @since 0.1.1
 */
export function formatFileSize(bytes: number, locale?: string): string {
  return formatByteSize(Math.max(0, Number.isFinite(bytes) ? bytes : 0), { locale })
}
