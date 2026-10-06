"use client"
// The segmented field DateField and TimeField share: each value (day, month, year, hour, minute, second, AM/PM) is a
// `role="spinbutton"` segment, after the React Aria DateField pattern.

import * as React from "react"
import { cn } from "@/lib/utils"
import { expandYear, formatNumber, toAsciiDigits, type FieldPart } from "@/lib/dates"
import { useFormReset } from "@/lib/form-reset"
import { shareNode } from "@/lib/refs"
import type { ControlSize, FieldVariant } from "@booleanpress/ui/provider"

/** The kinds of segment. */
export type SegmentType = Exclude<FieldPart["type"], "literal">

/** What the segments hold: a number per filled segment (the month 1 to 12, AM 0 and PM 1). */
export type SegmentValues = Partial<Record<SegmentType, number>>

/** The range of a segment, and the step of its arrow keys. */
export interface SegmentLimits {
  min: number
  max: number
  step?: number
}

const DIGITS: Record<SegmentType, number> = { year: 4, month: 2, day: 2, hour: 2, minute: 2, second: 2, dayPeriod: 1 }

/** The next value up or down from `value`, on the step's grid, wrapping at the ends. An empty segment starts at an end. */
export function stepSegment(value: number | undefined, delta: 1 | -1, { min, max, step = 1 }: SegmentLimits): number {
  const top = max - ((max - min) % step)
  if (value === undefined) return delta > 0 ? min : top
  if (delta > 0) {
    const next = min + (Math.floor((value - min) / step) + 1) * step
    return next > max ? min : next
  }
  const offset = (value - min) % step
  const previous = offset === 0 ? value - step : value - offset
  return previous < min ? top : previous
}

const valueKey = (value: Date | null | undefined) => (value === undefined ? "none" : value === null ? "empty" : value.getTime())

/**
 * The segments' values and the `Date` they make, controlled or not. The value changes only when every segment is filled
 * (to the new date) or when a filled field loses a segment (to null).
 *
 * Controlled, the parent's `value` is the value, shown and submitted: a change is only proposed through
 * `onValueChange`. A whole date the parent does not take puts the segments back, as a controlled input refuses a
 * keystroke; a part-filled field stays as typed, so a segment can be cleared and typed again. Uncontrolled, `reset` puts
 * the default back (a form's reset).
 */
export function useSegmentedValue({
  value,
  defaultValue,
  onValueChange,
  toSegments,
  fromSegments,
  formatKey,
}: {
  value: Date | null | undefined
  defaultValue: Date | null | undefined
  onValueChange: ((value: Date | null) => void) | undefined
  toSegments: (date: Date) => SegmentValues
  fromSegments: (segments: SegmentValues) => Date | null
  /** What the segments are written in (time zone, hour cycle, seconds): when it changes they are read again from the value. */
  formatKey: string
}) {
  const controlled = value !== undefined
  const initial = controlled ? value : (defaultValue ?? null)
  const [segments, setSegments] = React.useState<SegmentValues>(() => (initial ? toSegments(initial) : {}))
  // Uncontrolled, the value; controlled, the last value proposed to the parent.
  const [current, setCurrent] = React.useState<Date | null>(initial)
  // Controlled: a whole date was just proposed. If the parent's value is unchanged at the next render, it was refused.
  const [awaiting, setAwaiting] = React.useState(false)
  const [previousKey, setPreviousKey] = React.useState(valueKey(value))
  const [previousFormat, setPreviousFormat] = React.useState(formatKey)

  const key = valueKey(value)
  if (key !== previousKey) {
    // A new value from the parent replaces the segments, unless it is the one they just proposed.
    setPreviousKey(key)
    setAwaiting(false)
    if (controlled && key !== valueKey(current)) {
      setSegments(value ? toSegments(value) : {})
      setCurrent(value)
    }
  } else if (awaiting) {
    // The parent kept its value: the segments go back to it.
    setAwaiting(false)
    setSegments(value ? toSegments(value) : {})
    setCurrent(value ?? null)
  }
  // A new time zone or hour cycle writes the same value in other segments (21:30 becomes 9:30 PM).
  if (formatKey !== previousFormat) {
    setPreviousFormat(formatKey)
    const shown = value !== undefined ? value : current
    if (shown) setSegments(toSegments(shown))
  }

  const change = (next: SegmentValues) => {
    setSegments(next)
    const date = fromSegments(next)
    if (valueKey(date) === valueKey(current)) return
    setCurrent(date)
    if (controlled && date !== null && valueKey(date) !== key) setAwaiting(true)
    onValueChange?.(date)
  }

  const reset = controlled
    ? undefined
    : () => {
        const start = defaultValue ?? null
        setSegments(start ? toSegments(start) : {})
        setCurrent(start)
      }

  return { segments, value: controlled ? value : current, change, reset }
}

interface SegmentedFieldProps extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue" | "children"> {
  /** `time-field` or `date-field`: the root's `data-slot`, and its parts' prefix. */
  slot: string
  parts: FieldPart[]
  values: SegmentValues
  onValuesChange: (values: SegmentValues) => void
  limits: (type: SegmentType, values: SegmentValues) => SegmentLimits
  /** The text a filled segment shows ("09", "AM"). */
  display: (type: SegmentType, value: number) => string
  /** What a screen reader hears for a filled segment ("October", "9 PM"). */
  valueText: (type: SegmentType, value: number) => string
  labels: Record<SegmentType, string>
  emptyText: string
  dayPeriods: [string, string]
  locale: string | undefined
  size: ControlSize
  variant: FieldVariant
  fluid?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  /** The id of the form the hidden input belongs to, for a field outside it. */
  form?: string
  formValue?: string
  /** Puts the default back when the form is reset; absent for a controlled field, whose parent owns the value. */
  onFormReset?: () => void
}

/** The field: a group of segments and the separators the locale writes between them. */
export function SegmentedField({
  slot,
  parts,
  values,
  onValuesChange,
  limits,
  display,
  valueText,
  labels,
  emptyText,
  dayPeriods,
  locale,
  size,
  variant,
  fluid = false,
  disabled = false,
  readOnly = false,
  required = false,
  invalid = false,
  name,
  form,
  formValue,
  onFormReset,
  className,
  id,
  "aria-labelledby": labelledBy,
  onMouseDown,
  ref,
  ...props
}: SegmentedFieldProps) {
  const baseId = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const segmentRefs = React.useRef<Array<HTMLSpanElement | null>>([])
  // Digits typed into the focused segment so far: state to show them, a ref for handlers that run in the same event.
  const [typing, setTypingState] = React.useState<{ type: SegmentType; text: string } | null>(null)
  const typingRef = React.useRef(typing)
  const valuesRef = React.useRef(values)

  React.useLayoutEffect(() => {
    valuesRef.current = values
  }, [values])

  const setTyping = (next: { type: SegmentType; text: string } | null) => {
    typingRef.current = next
    setTypingState(next)
  }

  // A form's reset drops the digits being typed and puts the default back.
  useFormReset(
    rootRef,
    () => {
      setTyping(null)
      onFormReset?.()
    },
    { enabled: Boolean(onFormReset), form }
  )

  const commit = (patch: SegmentValues) => {
    const next = { ...valuesRef.current, ...patch }
    for (const type of Object.keys(patch) as SegmentType[]) if (patch[type] === undefined) delete next[type]
    valuesRef.current = next
    onValuesChange(next)
  }

  const segmentTypes = parts.filter((part): part is { type: SegmentType } => part.type !== "literal").map((part) => part.type)

  const focusSegment = (index: number) => {
    const target = segmentRefs.current[Math.max(0, Math.min(segmentTypes.length - 1, index))]
    target?.focus()
  }

  const typeDigit = (index: number, type: SegmentType, digit: string) => {
    const range = limits(type, valuesRef.current)
    const previous = typingRef.current?.type === type ? typingRef.current.text : ""
    let text = previous + digit
    if (text.length > DIGITS[type] || Number(text) > range.max) text = digit
    const number = Number(text)
    const complete = text.length >= DIGITS[type] || number * 10 > range.max
    if (complete) {
      setTyping(null)
      commit({ [type]: Math.max(range.min, Math.min(range.max, number)) })
      if (index < segmentTypes.length - 1) focusSegment(index + 1)
      return
    }
    setTyping({ type, text })
    // A year is written once it has its four digits, or when focus leaves it; other segments as each digit lands.
    if (type !== "year") commit({ [type]: number >= range.min ? number : undefined })
  }

  const typeLetter = (index: number, letter: string) => {
    const typed = letter.toLocaleLowerCase()
    const [am, pm] = dayPeriods.map((name) => name.toLocaleLowerCase())
    const period = pm.startsWith(typed) ? 1 : am.startsWith(typed) ? 0 : typed === "p" ? 1 : typed === "a" ? 0 : undefined
    if (period === undefined) return
    setTyping(null)
    commit({ dayPeriod: period })
    if (index < segmentTypes.length - 1) focusSegment(index + 1)
  }

  /** Removes the segment's last digit; an empty segment moves focus to the previous one. */
  const backspace = (index: number, type: SegmentType) => {
    const value = valuesRef.current[type]
    const buffer = typingRef.current?.type === type ? typingRef.current.text : ""
    const shown = buffer || (value !== undefined && type !== "dayPeriod" ? String(value) : "")
    if (!shown && value === undefined) {
      focusSegment(index - 1)
      return
    }
    const rest = shown.slice(0, -1)
    setTyping(rest ? { type, text: rest } : null)
    commit({ [type]: rest && type !== "year" ? Number(rest) : undefined })
  }

  const handleKeyDown = (index: number, type: SegmentType) => (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.key === "Tab") return
    const editable = !disabled && !readOnly
    const value = valuesRef.current[type]
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault()
        if (!editable) return
        setTyping(null)
        commit({ [type]: stepSegment(value, event.key === "ArrowUp" ? 1 : -1, limits(type, valuesRef.current)) })
        return
      }
      case "ArrowLeft":
      case "ArrowRight": {
        event.preventDefault()
        // The segments are laid out left to right in every direction, as a number is, so the arrows need no flip.
        focusSegment(index + (event.key === "ArrowRight" ? 1 : -1))
        return
      }
      case "Home":
      case "End": {
        event.preventDefault()
        if (!editable) return
        const range = limits(type, valuesRef.current)
        setTyping(null)
        commit({ [type]: event.key === "Home" ? range.min : stepSegment(undefined, -1, range) })
        return
      }
      case "Backspace": {
        event.preventDefault()
        if (editable) backspace(index, type)
        return
      }
      case "Delete": {
        event.preventDefault()
        if (!editable) return
        setTyping(null)
        commit({ [type]: undefined })
        return
      }
      case "Enter":
      case "Escape":
        if (event.key === "Enter") event.preventDefault()
        return
    }
    if (event.key.length !== 1) return
    event.preventDefault()
    if (!editable) return
    const character = toAsciiDigits(event.key, locale)
    if (/^\d$/.test(character) && type !== "dayPeriod") typeDigit(index, type, character)
    else if (type === "dayPeriod") typeLetter(index, event.key)
  }

  // A phone's keyboard sends text, and its Backspace, without key events: read them here, and stop every other edit of
  // the segment's text.
  const handleBeforeInput = (index: number, type: SegmentType) => (event: InputEvent) => {
    event.preventDefault()
    if (disabled || readOnly) return
    if (event.inputType === "deleteContentBackward") {
      backspace(index, type)
      return
    }
    if (event.inputType.startsWith("delete")) {
      setTyping(null)
      commit({ [type]: undefined })
      return
    }
    if (!event.data) return
    for (const character of event.data) {
      const digit = toAsciiDigits(character, locale)
      if (/^\d$/.test(digit) && type !== "dayPeriod") typeDigit(index, type, digit)
      else if (type === "dayPeriod") typeLetter(index, character)
    }
  }

  const handleBlur = (type: SegmentType) => () => {
    const buffer = typingRef.current
    if (!buffer || buffer.type !== type) return
    setTyping(null)
    // A year of one or two digits is the one nearest this year ("85" is 1985, "30" is 2030 in 2026).
    if (type === "year") commit({ year: Math.max(1, expandYear(buffer.text)) })
  }

  // A native listener: React's onBeforeInput is not the native event, and phones need the native one.
  const attach = (index: number, type: SegmentType) => (node: HTMLSpanElement | null) => {
    segmentRefs.current[index] = node
    if (!node) return
    const handler = handleBeforeInput(index, type) as EventListener
    node.addEventListener("beforeinput", handler)
    return () => {
      node.removeEventListener("beforeinput", handler)
      if (segmentRefs.current[index] === node) segmentRefs.current[index] = null
    }
  }

  let segmentIndex = -1
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- a press on the padding only moves focus to a segment; the segments take the keys.
    <div
      ref={(node) => shareNode(node, [rootRef, ref])}
      role="group"
      dir="ltr"
      id={id}
      aria-labelledby={labelledBy}
      aria-disabled={disabled || undefined}
      data-slot={slot}
      data-size={size}
      data-variant={variant}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      className={cn(
        "inline-flex w-fit min-w-0 cursor-text items-center rounded-md border border-control bg-field px-2 py-1.5 text-sm/normal whitespace-nowrap text-foreground tabular-nums shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none hover:border-control-hover focus-within:border-ring",
        "data-[size=sm]:px-1.5 data-[size=sm]:py-1 data-[size=sm]:text-xs/normal data-[size=lg]:px-2.5 data-[size=lg]:py-2 data-[size=lg]:text-base/normal",
        "data-[variant=filled]:bg-field-filled",
        "data-[invalid]:border-invalid data-[invalid]:focus-within:border-ring",
        "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-control data-[disabled]:bg-field-disabled data-[disabled]:text-field-disabled-foreground",
        fluid && "w-full",
        className
      )}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        // A press on the field's padding or a separator focuses the first empty segment, or the last one.
        const target = event.target as HTMLElement
        const onPadding = target === event.currentTarget || target.dataset.slot === `${slot}-literal`
        if (event.defaultPrevented || !onPadding || disabled) return
        event.preventDefault()
        const empty = segmentTypes.findIndex((type) => valuesRef.current[type] === undefined)
        focusSegment(empty >= 0 ? empty : segmentTypes.length - 1)
      }}
      {...props}
    >
      {parts.map((part, partIndex) => {
        if (part.type === "literal") {
          return (
            <span key={partIndex} aria-hidden="true" data-slot={`${slot}-literal`} className="whitespace-pre">
              {part.text}
            </span>
          )
        }
        const type = part.type
        const index = ++segmentIndex
        const value = values[type]
        const range = limits(type, values)
        const buffer = typing?.type === type ? typing.text : ""
        const empty = value === undefined && !buffer
        const text = buffer
          ? formatNumber(Number(buffer), locale, buffer.length)
          : value !== undefined
            ? display(type, value)
            : type === "year"
              ? "––––"
              : "––"
        const segmentId = `${baseId}-${type}`
        return (
          <span
            key={partIndex}
            ref={attach(index, type)}
            id={segmentId}
            role="spinbutton"
            tabIndex={disabled ? -1 : 0}
            contentEditable={!disabled && !readOnly}
            suppressContentEditableWarning
            spellCheck={false}
            autoCorrect="off"
            inputMode={type === "dayPeriod" ? "text" : "numeric"}
            enterKeyHint="next"
            aria-label={labels[type]}
            aria-labelledby={labelledBy ? `${labelledBy} ${segmentId}` : undefined}
            aria-valuemin={range.min}
            aria-valuemax={range.max}
            aria-valuenow={value}
            aria-valuetext={value !== undefined ? valueText(type, value) : emptyText}
            aria-invalid={invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-required={required || undefined}
            aria-disabled={disabled || undefined}
            data-slot={`${slot}-segment`}
            data-type={type}
            data-placeholder={empty || undefined}
            className={cn(
              "rounded-sm px-0.5 text-center caret-transparent outline-none select-none focus:bg-primary focus:text-primary-foreground data-[placeholder]:text-muted-foreground data-[placeholder]:focus:text-primary-foreground",
              type === "year" ? "min-w-[calc(4ch+0.25rem)]" : type === "dayPeriod" ? "" : "min-w-[calc(2ch+0.25rem)]",
              disabled && "data-[placeholder]:text-field-disabled-foreground"
            )}
            onKeyDown={handleKeyDown(index, type)}
            onBlur={handleBlur(type)}
            onFocus={() => {
              if (typingRef.current && typingRef.current.type !== type) setTyping(null)
            }}
          >
            {text}
          </span>
        )
      })}
      {name ? <input type="hidden" name={name} value={formValue ?? ""} disabled={disabled} form={form} /> : null}
    </div>
  )
}
