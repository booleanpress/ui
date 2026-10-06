"use client"

// A dial built on an SVG with role="slider" (APG Slider): a 300° arc, arrow and page keys, and a drag round the circle.

import * as React from "react"
import { useFormReset } from "@/lib/form-reset"
import { cn } from "@/lib/utils"
import { useControlSize, useUiLocale, type ControlSize } from "@booleanpress/ui/provider"

// The arc runs 300°, from 150° left of the top, clockwise, to 150° right of it, on a circle of radius 40 in a 100 × 100
// box, as the visual target draws it.
const START = -150
const SWEEP = 300
const RADIUS = 40

/** The point of the circle at an angle, in degrees clockwise from the top. */
function point(angle: number) {
  const rad = (angle * Math.PI) / 180
  return { x: 50 + RADIUS * Math.sin(rad), y: 50 - RADIUS * Math.cos(rad) }
}

function arc(from: number, to: number) {
  const a = point(from)
  const b = point(to)
  const large = Math.abs(to - from) > 180 ? 1 : 0
  const clockwise = to >= from ? 1 : 0
  const round = (n: number) => Math.round(n * 1000) / 1000
  return `M ${round(a.x)} ${round(a.y)} A ${RADIUS} ${RADIUS} 0 ${large} ${clockwise} ${round(b.x)} ${round(b.y)}`
}

const sizes: Record<ControlSize, string> = {
  sm: "size-20",
  default: "size-25",
  lg: "size-37.5",
}

type KnobProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** The value, when you control it. */
  value?: number
  /** The value at the start, when it controls itself. `min` by default. */
  defaultValue?: number
  /** Called with the new value while it changes. */
  onValueChange?: (value: number) => void
  /** Called with the value once a drag or a key press ends. */
  onValueCommit?: (value: number) => void
  /** The lowest value. 0 by default. */
  min?: number
  /** The highest value. 100 by default. */
  max?: number
  /** The amount each move changes the value by. 1 by default. */
  step?: number
  /** The dial's width and height: 80, 100 or 150 px. Defaults to the provider's `controlSize`; a `size-*` class sets any other. */
  size?: ControlSize
  /** The arc's thickness, in hundredths of the dial's width. 14 by default. */
  strokeWidth?: number
  /** The text in the middle, and the value screen readers announce: `(value) => \`${value}%\``. The number by default. */
  formatValue?: (value: number) => string
  /** Shows the value in the middle. True by default. */
  showValue?: boolean
  /** The colour of the value's arc, any CSS colour. `--primary` by default. */
  valueColor?: string
  /** The colour of the rest of the arc. `--border` by default. */
  rangeColor?: string
  /** The colour of the value text. `--muted-foreground` by default. */
  textColor?: string
  /** Keeps the dial focusable and announced but ignores the pointer and the keys. */
  readOnly?: boolean
  /** Dims the dial and takes it out of the tab order. */
  disabled?: boolean
  /** The form field name: the value is submitted with the form, and a form reset brings back the first value. */
  name?: string
  /** The id of the form the value belongs to, for a control placed outside it. */
  form?: string
}

/**
 * A round slider: drag round the dial, or use the arrow keys, Page Up/Down, Home and End. Name it with `aria-label` or
 * `aria-labelledby`.
 *
 * @since 0.1.1
 */
function Knob({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  size,
  strokeWidth = 14,
  formatValue,
  showValue = true,
  valueColor,
  rangeColor,
  textColor,
  readOnly = false,
  disabled = false,
  name,
  form,
  className,
  style,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  ...props
}: KnobProps) {
  const resolvedSize = useControlSize(size)
  const { locale } = useUiLocale()
  const [inner, setInner] = React.useState(() => defaultValue ?? min)
  const current = Math.min(max, Math.max(min, value ?? inner))
  const currentRef = React.useRef(current)
  React.useEffect(() => {
    currentRef.current = current
  })

  const number = React.useMemo(() => new Intl.NumberFormat(locale), [locale])
  const text = formatValue ? formatValue(current) : number.format(current)

  const snap = (n: number) => {
    const stepped = Math.round((n - min) / step) * step + min
    // Steps like 0.1 add floating-point dust; keep as many decimals as the step has.
    const decimals = (String(step).split(".")[1] ?? "").length
    return Math.min(max, Math.max(min, Number(stepped.toFixed(decimals))))
  }

  const set = (next: number) => {
    const snapped = snap(next)
    if (snapped === currentRef.current) return
    currentRef.current = snapped
    if (value === undefined) setInner(snapped)
    onValueChange?.(snapped)
  }

  // A form reset brings back the first value, as it does for a native range input.
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  useFormReset(rootRef, () => set(defaultValue ?? min), { enabled: value === undefined, form })

  const angleOf = (n: number) => START + ((n - min) / (max - min || 1)) * SWEEP
  // The value's arc starts at zero when the range spans it (−50 to 50), else at the minimum.
  const origin = min < 0 && max > 0 ? 0 : min
  const interactive = !readOnly && !disabled

  const fromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI
    // Below the dial, between the arc's two ends, the nearer end wins.
    angle = Math.min(-START, Math.max(START, angle))
    set(min + ((angle - START) / SWEEP) * (max - min))
  }

  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (!interactive) return
    const big = step * 10
    const moves: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: big,
      PageDown: -big,
    }
    let next: number
    if (event.key === "Home") next = min
    else if (event.key === "End") next = max
    else if (event.key in moves) next = current + moves[event.key] * (event.shiftKey && event.key.startsWith("Arrow") ? 10 : 1)
    else return
    event.preventDefault()
    set(next)
    onValueCommit?.(currentRef.current)
  }

  const width = Math.min(20, Math.max(1, strokeWidth))

  return (
    <div
      ref={setRootRef}
      data-slot="knob"
      data-size={resolvedSize}
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      className={cn("relative inline-flex shrink-0 data-[disabled]:opacity-60", sizes[resolvedSize], className)}
      style={
        {
          "--knob-value": valueColor,
          "--knob-range": rangeColor,
          "--knob-text": textColor,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <svg
        viewBox="0 0 100 100"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-valuetext={formatValue ? text : undefined}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        data-slot="knob-dial"
        className={cn(
          // The BooleanPress look of the visual target: the arc in `--border`, the value in `--primary`, 18-unit text
          // in `--muted-foreground`; keyboard focus is the 1px `--ring` outline 2px round the dial.
          "size-full touch-none rounded-full transition-[outline-color] duration-(--bui-duration-control) outline-none select-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
          interactive ? "cursor-pointer" : "cursor-default",
          disabled && "pointer-events-none"
        )}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          if (!interactive || event.button !== 0) return
          event.preventDefault()
          event.currentTarget.setPointerCapture?.(event.pointerId)
          event.currentTarget.focus({ preventScroll: true })
          fromPointer(event)
        }}
        onPointerMove={(event) => {
          if (interactive && event.currentTarget.hasPointerCapture?.(event.pointerId)) fromPointer(event)
        }}
        onPointerUp={(event) => {
          if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return
          event.currentTarget.releasePointerCapture(event.pointerId)
          onValueCommit?.(currentRef.current)
        }}
      >
        <path
          data-slot="knob-range"
          d={arc(START, START + SWEEP)}
          fill="none"
          strokeWidth={width}
          className="stroke-[var(--knob-range,var(--border))] transition-[stroke] duration-(--bui-duration-control)"
        />
        {current !== origin ? (
          <path
            data-slot="knob-value"
            d={arc(angleOf(origin), angleOf(current))}
            fill="none"
            strokeWidth={width}
            className="stroke-[var(--knob-value,var(--primary))]"
          />
        ) : null}
        {showValue ? (
          <text
            data-slot="knob-text"
            x="50"
            y="57"
            textAnchor="middle"
            aria-hidden="true"
            className="fill-[var(--knob-text,var(--muted-foreground))] text-[18px] font-normal"
          >
            {text}
          </text>
        ) : null}
      </svg>
      {name ? <input type="hidden" name={name} value={current} disabled={disabled} form={form} data-slot="knob-input" /> : null}
    </div>
  )
}

export { Knob }
