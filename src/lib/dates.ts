// Calendar dates in a time zone, formatted and parsed with Intl alone (no date library). Shared by DatePicker,
// DateRangePicker, DateField and TimeField.
//
// A value is a plain `Date`: the instant of its wall-clock time in the provider's `timeZone` (midnight, for a day), or
// in the browser's zone when the provider sets none. Every date is read and written on the Gregorian calendar.

/** A wall-clock date and time. `month` is 1 to 12. */
export interface DateParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

/** The fields a typed date can hold: the time ones only when it has a time. */
export interface ParsedDate {
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  second?: number
}

/** What a picker shows and parses: days, months or years. */
export type DateView = "day" | "month" | "year"

/** Where the field is: a date and an optional time, read and written in a locale and a time zone. */
export interface DateTextOptions {
  locale?: string
  timeZone?: string
  /** A pattern such as `"dd/MM/yyyy"`; without it the locale's numeric date. */
  format?: string
  view?: DateView
  showTime?: boolean
  /** 12 or 24; without it the locale's. */
  hourCycle?: 12 | 24
  /** The year a typed one- or two-digit year is read near (see `expandYear`); without it the current year. */
  referenceYear?: number
}

/**
 * Plain spaces for the narrow and no-break spaces newer Intl data puts round "AM" and in ranges ("9:30\u202fAM"), so
 * the text the server renders matches the browser's whatever version of the data each has, and typed spaces match.
 */
export function plainSpaces(text: string): string {
  return text.replace(/[\u00a0\u2009\u202f]/g, " ")
}

const formatters = new Map<string, Intl.DateTimeFormat>()

/** A cached `Intl.DateTimeFormat` on the Gregorian calendar: building one is slow, and fields format on every key. */
export function dateFormatter(locale: string | undefined, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale ?? ""}|${JSON.stringify(options)}`
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, { calendar: "gregory", ...options })
    formatters.set(key, formatter)
  }
  return formatter
}

const numberFormatters = new Map<string, Intl.NumberFormat>()

/** A whole number in the locale's digits, padded to `digits` places. */
export function formatNumber(value: number, locale: string | undefined, digits = 1): string {
  const key = `${locale ?? ""}|${digits}`
  let formatter = numberFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { minimumIntegerDigits: digits, useGrouping: false })
    numberFormatters.set(key, formatter)
  }
  return formatter.format(value)
}

/** Replaces the locale's own digits (Arabic-Indic, Devanagari…) with ASCII ones, so typed text parses in any locale. */
export function toAsciiDigits(text: string, locale: string | undefined): string {
  let result = text
  for (let digit = 0; digit < 10; digit++) {
    const local = formatNumber(digit, locale)
    if (local !== String(digit)) result = result.split(local).join(String(digit))
  }
  return result
}

/** The wall-clock parts of an instant in a time zone (the browser's when none is given). */
export function getDateParts(date: Date, timeZone?: string): DateParts {
  if (!timeZone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    }
  }
  const parts = dateFormatter("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(date)
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0)
  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour") % 24,
    minute: read("minute"),
    second: read("second"),
  }
}

function utcTime(parts: DateParts): number {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second))
  if (parts.year < 100) date.setUTCFullYear(parts.year)
  return date.getTime()
}

/** How far the zone's wall clock is ahead of UTC at an instant, in milliseconds. */
function zoneOffset(time: number, timeZone: string): number {
  return utcTime(getDateParts(new Date(time), timeZone)) - Math.floor(time / 1000) * 1000
}

const DAY_MS = 86_400_000

const sameWallClock = (a: DateParts, b: DateParts) =>
  a.year === b.year && a.month === b.month && a.day === b.day && a.hour === b.hour && a.minute === b.minute && a.second === b.second

/**
 * The instant a wall-clock time happens in a time zone (the browser's when none is given). A time that happens twice
 * (the hour the clocks go back) is its first instant; a time that never happens (the hour they go forward, which is
 * midnight itself in zones such as America/Santiago or America/Havana) moves forward by the jump, as `Date` does, so a
 * day is never read as the day before.
 */
export function dateFromParts(parts: DateParts, timeZone?: string): Date {
  if (!timeZone) {
    const date = new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
    if (parts.year < 100) date.setFullYear(parts.year, parts.month - 1, parts.day)
    return date
  }
  const asUtc = utcTime(parts)
  // The zone's offset a day before and a day after: they differ only when a change of offset falls in between.
  const before = asUtc - zoneOffset(asUtc - DAY_MS, timeZone)
  if (sameWallClock(getDateParts(new Date(before), timeZone), parts)) return new Date(before)
  const after = asUtc - zoneOffset(asUtc + DAY_MS, timeZone)
  if (sameWallClock(getDateParts(new Date(after), timeZone), parts)) return new Date(after)
  // In the gap the clocks skip: the earlier offset puts the time past the jump.
  return new Date(before)
}

/** The number of days in a month (1 to 12) of a year. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** The parts moved by whole days, months or years; the day is kept inside the new month. */
export function shiftParts(parts: DateParts, { days = 0, months = 0, years = 0 }): DateParts {
  const monthIndex = parts.month - 1 + months + years * 12
  const year = parts.year + Math.floor(monthIndex / 12)
  const month = (((monthIndex % 12) + 12) % 12) + 1
  const day = Math.min(parts.day, daysInMonth(year, month))
  const moved = new Date(Date.UTC(year, month - 1, day + days))
  if (year < 100) moved.setUTCFullYear(year, month - 1, day + days)
  return { ...parts, year: moved.getUTCFullYear(), month: moved.getUTCMonth() + 1, day: moved.getUTCDate() }
}

/** Midnight of the instant's day in the time zone. */
export function startOfDay(date: Date, timeZone?: string): Date {
  return dateFromParts({ ...getDateParts(date, timeZone), hour: 0, minute: 0, second: 0 }, timeZone)
}

/** A number that orders calendar days: equal for two instants on the same day in the zone. */
export function dayNumber(date: Date, timeZone?: string): number {
  const { year, month, day } = getDateParts(date, timeZone)
  return year * 10000 + month * 100 + day
}

/** Seconds since midnight of the instant's wall-clock time in the zone. */
export function secondOfDay(date: Date, timeZone?: string): number {
  const { hour, minute, second } = getDateParts(date, timeZone)
  return hour * 3600 + minute * 60 + second
}

/** Whether the locale writes times on a 12-hour clock. */
export function uses12Hour(locale: string | undefined): boolean {
  const cycle = dateFormatter(locale, { hour: "numeric" }).resolvedOptions().hourCycle
  return cycle === "h12" || cycle === "h11"
}

/** The locale's names for the morning and the afternoon ("AM", "PM"). */
export function dayPeriodNames(locale: string | undefined): [string, string] {
  const formatter = dateFormatter(locale, { hour: "numeric", hourCycle: "h12", timeZone: "UTC" })
  const name = (hour: number) =>
    plainSpaces(formatter.formatToParts(Date.UTC(2026, 0, 1, hour)).find((part) => part.type === "dayPeriod")?.value ?? "")
  return [name(1), name(13)]
}

/** The locale's twelve month names, January first. */
export function monthNames(locale: string | undefined, width: "long" | "short" = "long"): string[] {
  const formatter = dateFormatter(locale, { month: width, timeZone: "UTC" })
  return Array.from({ length: 12 }, (_, index) => plainSpaces(formatter.format(Date.UTC(2026, index, 15))))
}

/** One piece of a field, in the locale's order: a value or the text between values. */
export type FieldPart =
  | { type: "year" | "month" | "day" | "hour" | "minute" | "second" | "dayPeriod" }
  | { type: "literal"; text: string }

const FIELD_TYPES = new Set(["year", "month", "day", "hour", "minute", "second", "dayPeriod"])

/** The fields and separators the locale writes for these options, in its order ("10/05/2026" → month, /, day, /, year). */
export function fieldParts(locale: string | undefined, options: Intl.DateTimeFormatOptions): FieldPart[] {
  return dateFormatter(locale, { ...options, timeZone: "UTC" })
    .formatToParts(Date.UTC(2026, 10, 22, 13, 45, 56))
    .map((part) =>
      FIELD_TYPES.has(part.type)
        ? ({ type: part.type } as FieldPart)
        : ({ type: "literal", text: plainSpaces(part.value) } as FieldPart)
    )
}

function intlOptions(options: DateTextOptions, withTime: boolean): Intl.DateTimeFormatOptions {
  const view = options.view ?? "day"
  const result: Intl.DateTimeFormatOptions = { year: "numeric" }
  if (view !== "year") result.month = "2-digit"
  if (view === "day") result.day = "2-digit"
  if (withTime && view === "day") {
    result.hour = "2-digit"
    result.minute = "2-digit"
    if (options.hourCycle) result.hourCycle = options.hourCycle === 12 ? "h12" : "h23"
  }
  return result
}

const TOKEN = /'[^']*'|yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|HH|H|hh|h|mm|m|ss|s|a/g

/** A date as `format` writes it: `yyyy` `yy` `MMMM` `MMM` `MM` `M` `dd` `d` `EEEE` `EEE` `HH` `H` `hh` `h` `mm` `ss` `a`. */
function formatPattern(date: Date, pattern: string, options: DateTextOptions): string {
  const { locale, timeZone } = options
  const parts = getDateParts(date, timeZone)
  const hour12 = parts.hour % 12 || 12
  return pattern.replace(TOKEN, (token) => {
    switch (token) {
      case "yyyy":
        return formatNumber(parts.year, locale, 4)
      case "yy":
        return formatNumber(parts.year % 100, locale, 2)
      case "MMMM":
        return monthNames(locale, "long")[parts.month - 1]
      case "MMM":
        return monthNames(locale, "short")[parts.month - 1]
      case "MM":
        return formatNumber(parts.month, locale, 2)
      case "M":
        return formatNumber(parts.month, locale)
      case "dd":
        return formatNumber(parts.day, locale, 2)
      case "d":
        return formatNumber(parts.day, locale)
      case "EEEE":
      case "EEE":
        return dateFormatter(locale, { weekday: token === "EEEE" ? "long" : "short", timeZone }).format(date)
      case "HH":
        return formatNumber(parts.hour, locale, 2)
      case "H":
        return formatNumber(parts.hour, locale)
      case "hh":
        return formatNumber(hour12, locale, 2)
      case "h":
        return formatNumber(hour12, locale)
      case "mm":
        return formatNumber(parts.minute, locale, 2)
      case "m":
        return formatNumber(parts.minute, locale)
      case "ss":
        return formatNumber(parts.second, locale, 2)
      case "s":
        return formatNumber(parts.second, locale)
      case "a":
        return dayPeriodNames(locale)[parts.hour < 12 ? 0 : 1]
      default:
        return token.slice(1, -1)
    }
  })
}

/** The text a date field shows for a date. */
export function formatDateText(date: Date, options: DateTextOptions): string {
  if (options.format) return plainSpaces(formatPattern(date, options.format, options))
  return plainSpaces(
    dateFormatter(options.locale, { ...intlOptions(options, Boolean(options.showTime)), timeZone: options.timeZone }).format(date)
  )
}

const normalise = (text: string) => text.toLocaleLowerCase().replace(/\./g, "").trim()

/**
 * The month (1 to 12) a typed word names: the locale's long or short name whatever its length ("十月"), or a prefix of
 * three letters or more ("oct").
 */
function monthFromName(word: string, locale: string | undefined): number | undefined {
  const typed = normalise(word)
  if (!typed) return undefined
  for (const width of ["long", "short"] as const) {
    const index = monthNames(locale, width).findIndex((name) => {
      const known = normalise(name)
      return known === typed || (typed.length >= 3 && known.startsWith(typed))
    })
    if (index >= 0) return index + 1
  }
  return undefined
}

/** The letters of a day-period name or typed text, without spaces and punctuation ("p.m." and "PM" are both "pm"). */
const periodLetters = (text: string) => text.toLocaleLowerCase().replace(/[\s\p{P}]/gu, "")

/** 0 for a morning name, 1 for an afternoon one, undefined when the text names neither. */
function dayPeriodFromText(text: string, locale: string | undefined): 0 | 1 | undefined {
  const typed = periodLetters(text)
  if (!typed) return undefined
  const [am, pm] = dayPeriodNames(locale).map(periodLetters)
  if (pm && typed.includes(pm)) return 1
  if (am && typed.includes(am)) return 0
  if (/^p/.test(typed)) return 1
  if (/^a/.test(typed)) return 0
  return undefined
}

/**
 * A typed year. One or two digits are the year ending in them that is nearest `referenceYear`, within 50 years either
 * side ("85" is 1985 and "30" is 2030 in 2026), as people mean a short year; more digits are the year as typed.
 */
export function expandYear(text: string, referenceYear = new Date().getFullYear()): number {
  const year = Number(text)
  if (text.length > 2) return year
  const full = Math.floor(referenceYear / 100) * 100 + year
  if (full > referenceYear + 50) return full - 100
  if (full <= referenceYear - 50) return full + 100
  return full
}

function validated(result: ParsedDate): ParsedDate | null {
  const { year, month, day, hour, minute, second } = result
  if (!Number.isInteger(year) || year < 1 || year > 9999) return null
  if (!Number.isInteger(month) || month < 1 || month > 12) return null
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth(year, month)) return null
  if (hour !== undefined && (hour < 0 || hour > 23)) return null
  if (minute !== undefined && (minute < 0 || minute > 59)) return null
  if (second !== undefined && (second < 0 || second > 59)) return null
  return result
}

function applyDayPeriod(hour: number, period: 0 | 1 | undefined): number | undefined {
  if (period === undefined) return hour
  if (hour < 1 || hour > 12) return undefined
  return (hour % 12) + (period === 1 ? 12 : 0)
}

/**
 * A run of name text: letters with their combining marks (the vowel signs of Bengali, Devanagari, Tamil and Thai), and
 * dots. A month name also takes digits in the locales that write them ("10月").
 */
const NAME = "[\\p{L}\\p{M}.]+"
function monthNameSource(locale: string | undefined): string {
  const names = [...monthNames(locale, "long"), ...monthNames(locale, "short")]
  return names.some((name) => /\p{N}/u.test(name)) ? "([\\p{L}\\p{M}\\p{N}.]+)" : `(${NAME})`
}

/** Reads typed text with a `format` pattern. Separators match any punctuation or space, so "5-10-2026" reads as "dd/MM/yyyy". */
function parsePattern(text: string, pattern: string, locale: string | undefined, referenceYear?: number): ParsedDate | null {
  const fields: string[] = []
  let source = "^\\s*"
  let last = 0
  const literal = (chunk: string) => {
    if (!chunk) return
    source += /^[\s\p{P}\p{S}]*$/u.test(chunk) ? "[\\s\\p{P}\\p{S}]*" : chunk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }
  for (const match of pattern.matchAll(TOKEN)) {
    literal(pattern.slice(last, match.index))
    last = (match.index ?? 0) + match[0].length
    const token = match[0]
    if (token.startsWith("'")) {
      literal(token.slice(1, -1))
    } else if (token === "EEEE" || token === "EEE") {
      source += NAME
    } else {
      fields.push(token)
      if (token === "MMMM" || token === "MMM") source += monthNameSource(locale)
      else if (token === "a") source += "([\\p{L}\\p{M}.\\s]+?)"
      else if (token === "yyyy") source += "(\\d{1,4})"
      else source += "(\\d{1,2})"
    }
  }
  literal(pattern.slice(last))
  const match = new RegExp(`${source}\\s*$`, "iu").exec(text)
  if (!match) return null
  const result: ParsedDate = { year: NaN, month: NaN, day: NaN }
  let period: 0 | 1 | undefined
  fields.forEach((token, index) => {
    const value = match[index + 1]
    // A year typed with one or two digits is read near the reference year, as without a pattern.
    if (token === "yyyy" || token === "yy") result.year = expandYear(value, referenceYear)
    else if (token === "MMMM" || token === "MMM") result.month = monthFromName(value, locale) ?? NaN
    else if (token === "MM" || token === "M") result.month = Number(value)
    else if (token === "dd" || token === "d") result.day = Number(value)
    else if (token.toLowerCase().startsWith("h")) result.hour = Number(value)
    else if (token === "mm" || token === "m") result.minute = Number(value)
    else if (token === "ss" || token === "s") result.second = Number(value)
    else if (token === "a") period = dayPeriodFromText(value, locale)
  })
  if (result.hour !== undefined && fields.some((token) => token === "hh" || token === "h")) {
    const hour = applyDayPeriod(result.hour, period ?? 0)
    if (hour === undefined) return null
    result.hour = hour
  }
  if (!fields.some((token) => token.startsWith("y"))) return null
  if (!fields.some((token) => token.startsWith("M"))) result.month = 1
  if (!fields.some((token) => token.startsWith("d"))) result.day = 1
  if (result.minute === undefined && result.hour !== undefined) result.minute = 0
  return validated(result)
}

/**
 * Reads the text typed into a date field. Without `format` it takes the numbers in the locale's order ("10/05/2026" in
 * en-US, "05.10.2026" in de-DE), a month name in place of the month number, eight digits with no separators, a two-digit
 * year near `referenceYear` and, with `showTime`, the hours and minutes after the date with an optional AM or PM before
 * or after them. Returns null for text that is not a whole, real date.
 */
export function parseDateText(text: string, options: DateTextOptions): ParsedDate | null {
  const { locale } = options
  const typed = plainSpaces(toAsciiDigits(text, locale)).trim()
  if (!typed) return null
  if (options.format) return parsePattern(typed, options.format, locale, options.referenceYear)
  const view = options.view ?? "day"
  const order = fieldParts(locale, intlOptions(options, false))
    .map((part) => part.type)
    .filter((type): type is "year" | "month" | "day" => type === "year" || type === "month" || type === "day")

  const numbers = [...typed.matchAll(/\d+/g)]
  let month: number | undefined
  for (const word of typed.match(/\p{L}[\p{L}\p{M}.]*/gu) ?? []) {
    month = monthFromName(word, locale)
    if (month !== undefined) break
  }
  const wanted = month === undefined ? order : order.filter((type) => type !== "month")
  let dateNumbers = numbers.slice(0, wanted.length).map((match) => match[0])
  let rest = numbers.slice(wanted.length)
  let lastDateNumber = numbers[wanted.length - 1]
  // "05102026": one run of digits, cut in the locale's order (2 for a day or month, 2 or 4 for the year).
  if (numbers.length >= 1 && numbers.length < wanted.length && wanted.length > 1) {
    const run = numbers[0][0]
    const yearWidth = run.length - (wanted.length - 1) * 2
    if (yearWidth !== 2 && yearWidth !== 4) return null
    let at = 0
    dateNumbers = wanted.map((type) => {
      const width = type === "year" ? yearWidth : 2
      const piece = run.slice(at, at + width)
      at += width
      return piece
    })
    rest = numbers.slice(1)
    lastDateNumber = numbers[0]
  }
  if (dateNumbers.length < wanted.length) return null

  const result: ParsedDate = { year: NaN, month: month ?? 1, day: 1 }
  wanted.forEach((type, index) => {
    const value = dateNumbers[index]
    if (type === "year") result.year = expandYear(value, options.referenceYear)
    else if (type === "month") result.month = Number(value)
    else result.day = Number(value)
  })
  if (view !== "day") result.day = 1

  if (options.showTime && view === "day" && rest.length >= 1) {
    const [hourMatch, minuteMatch, secondMatch] = rest
    // AM or PM may come after the time ("9:30 PM") or before it (Korean "오후 9:30", Chinese "下午9:30").
    const timeText = typed.slice((lastDateNumber.index ?? 0) + lastDateNumber[0].length)
    const hour = applyDayPeriod(Number(hourMatch[0]), dayPeriodFromText(timeText.replace(/\d/g, ""), locale))
    if (hour === undefined) return null
    result.hour = hour
    result.minute = minuteMatch ? Number(minuteMatch[0]) : 0
    if (secondMatch) result.second = Number(secondMatch[0])
  } else if (rest.length > 0) {
    return null
  }
  return validated(result)
}

/** The instant of a parsed date in a time zone; fields it lacks come from `base` (the current value's time), else 0. */
export function dateFromParsed(parsed: ParsedDate, timeZone: string | undefined, base?: DateParts): Date {
  return dateFromParts(
    {
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
      hour: parsed.hour ?? base?.hour ?? 0,
      minute: parsed.minute ?? base?.minute ?? 0,
      second: parsed.second ?? (parsed.hour !== undefined ? 0 : (base?.second ?? 0)),
    },
    timeZone
  )
}

/** A date as ISO 8601 for a form: "2026-10-05" for a day, the full instant when it has a time. */
export function isoDate(date: Date, timeZone: string | undefined, withTime = false): string {
  if (withTime) return date.toISOString()
  const { year, month, day } = getDateParts(date, timeZone)
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}
