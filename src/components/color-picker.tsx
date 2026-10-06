"use client"

// A colour picker built on native range inputs (the area follows React Aria's ColorArea), Radix RadioGroup and Popover.

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { PipetteIcon } from "lucide-react"
import { Button } from "@/components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { useFormReset } from "@/lib/form-reset"
import { cn } from "@/lib/utils"
import { Input } from "@/components/input"
import { InputGroup, InputGroupInput } from "@/components/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import {
  useControlSize,
  useUiConfig,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

import { BLACK, clamp, parseHex, parseColor, toHex, rgbCss, keepHue, colorChannels, channelValue, withChannel, channelRange, toOklchCss, type Hsva, type ColorFormat, type ColorChannel } from "@/lib/color"

// The checks behind a colour with transparency, in the theme's surface colours: the last layer of a `background`.
const CHECKS = "conic-gradient(var(--muted) 0 25%, transparent 0 50%, var(--muted) 0 75%, transparent 0) 0 0 / 0.5rem 0.5rem var(--background)"

// The thumbs sit on the colour itself, so their ring is white in both themes. Keyboard focus shows a translucent
// white 2px outline 2px outside the thumb.
const THUMB =
  "pointer-events-none absolute z-1 size-4 rounded-full border-3 border-white shadow-md has-[:focus-visible]:border-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white/30 has-[:focus-visible]:outline-solid"

type KeyMove = number | "min" | "max" | null

/** The APG slider keys: one step by arrow (ten with Shift), ten by Page Up/Down, the ends by Home/End. */
function sliderKey(event: React.KeyboardEvent, horizontalFlip: boolean): KeyMove {
  const step = event.shiftKey ? 10 : 1
  switch (event.key) {
    case "ArrowRight":
      return horizontalFlip ? -step : step
    case "ArrowLeft":
      return horizontalFlip ? step : -step
    case "ArrowUp":
      return step
    case "ArrowDown":
      return -step
    case "PageUp":
      return 10
    case "PageDown":
      return -10
    case "Home":
      return "min"
    case "End":
      return "max"
    default:
      return null
  }
}

/** The part of a box a pointer is at, 0–1 on each axis, from the start edge (the right one in RTL) and the top. */
function pointerRatio(event: React.PointerEvent, box: HTMLElement, rtl: boolean) {
  const rect = box.getBoundingClientRect()
  const x = rect.width ? clamp((event.clientX - rect.left) / rect.width, 0, 1) : 0
  const y = rect.height ? clamp((event.clientY - rect.top) / rect.height, 0, 1) : 0
  return { x: rtl ? 1 - x : x, y }
}

interface ColorPickerProps extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "dir"> {
  /** A hex, RGB, HSL, HSB or OKLCH colour; change callbacks and form values use hex. */
  value?: string
  /** The colour at the start, when it controls itself. `#000000` by default. */
  defaultValue?: string
  /** Called with the new hex colour while it changes. */
  onValueChange?: (value: string) => void
  /** Called with the hex colour once a drag, a key press or an edit of the hex field ends. */
  onValueCommit?: (value: string) => void
  /** Enables transparency and its controls. True by default; non-opaque output carries an alpha pair. */
  alpha?: boolean
  /** The displayed format, when controlled; callbacks and form values remain hex. */
  format?: ColorFormat
  /** The initial displayed format. `hex` by default. */
  defaultFormat?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  /** Preset colours shown as swatches under the picker: hex strings, or `{ value, label }` to name them. */
  swatches?: ReadonlyArray<string | { value: string; label?: string }>
  /** `vertical` puts the hue (and alpha) slider upright beside the area. `horizontal` by default. */
  orientation?: "horizontal" | "vertical"
  /** Dims the picker and ignores the pointer and the keyboard. */
  disabled?: boolean
  /** The hex field's and swatches' size. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** The hex field's look. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** The form field name; the hex value is submitted with the form. */
  name?: string
  /** The id of the form the value belongs to, for a control placed outside it. */
  form?: string
}

/**
 * A colour picker: a saturation and brightness area, hue and alpha sliders, editable formats, an eyedropper and optional
 * preset swatches. Name it with `aria-label` or `aria-labelledby`; "Colour picker" by default.
 *
 * @since 0.1.1
 */
function ColorPicker({
  value,
  defaultValue = "#000000",
  onValueChange,
  onValueCommit,
  alpha = true,
  swatches,
  format: formatProp,
  defaultFormat = "hex",
  onFormatChange,
  children,
  orientation = "horizontal",
  disabled = false,
  size,
  variant,
  name,
  form,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: ColorPickerProps) {
  const strings = useUiStrings()
  const { dir } = useUiConfig()
  const rtl = dir === "rtl"
  const resolvedSize = useControlSize(size)
  const [innerFormat, setInnerFormat] = React.useState(defaultFormat)
  const format = formatProp ?? innerFormat
  const setFormat = (next: ColorFormat) => {
    if (formatProp === undefined) setInnerFormat(next)
    if (next !== format) onFormatChange?.(next)
  }

  // The colour lives as HSVA, so the hue and the exact position survive a grey or a round trip through hex. When the
  // value is controlled and the parent holds a different colour, that colour is shown.
  const [hsva, setHsva] = React.useState<Hsva>(() => parseColor(value ?? defaultValue) ?? BLACK)
  const parsedValue = value !== undefined ? parseColor(value) : null
  const color = parsedValue && toHex(parsedValue, alpha) !== toHex(hsva, alpha) ? keepHue(parsedValue, hsva) : hsva
  const hex = toHex(color, alpha)

  const colorRef = React.useRef(color)
  React.useEffect(() => {
    colorRef.current = color
  })

  const update = React.useCallback(
    (next: Hsva) => {
      const before = toHex(colorRef.current, alpha)
      colorRef.current = next
      setHsva(next)
      const after = toHex(next, alpha)
      if (after !== before) onValueChange?.(after)
    },
    [alpha, onValueChange]
  )
  const commit = React.useCallback(() => onValueCommit?.(toHex(colorRef.current, alpha)), [alpha, onValueCommit])

  // A form's reset puts an uncontrolled picker back to its `defaultValue`, as it does a native colour input.
  const hiddenRef = React.useRef<HTMLInputElement>(null)
  const controlled = value !== undefined
  useFormReset(
    hiddenRef,
    () => {
      const next = parseColor(defaultValue) ?? BLACK
      colorRef.current = next
      setHsva(next)
    },
    { enabled: !controlled, form }
  )

  const vertical = orientation === "vertical"
  const hue = <ColorPickerSlider channel="hue" format="hsba" orientation={orientation} />
  const alphaSlider = alpha ? <ColorPickerSlider channel="alpha" orientation={orientation} /> : null
  const area = <ColorPickerArea />
  const preview = <ColorSwatch data-slot="color-picker-preview" color={hex} className="size-9" />
  const field = (
    <div className="flex min-w-0 items-center gap-2">
      <ColorPickerFormatSelect />
      {format === "hex" ? <ColorPickerInput channel="hex" /> : format === "oklcha" ? <ColorPickerInput channel="css" /> : (
        <InputGroup attached size={resolvedSize} variant={variant} className="min-w-0 flex-1">
          {colorChannels[format].filter((channel) => alpha || channel !== "alpha").map((channel) => <ColorPickerInput key={`${format}-${channel}`} channel={channel} grouped />)}
        </InputGroup>
      )}
    </div>
  )

  return (
    <ColorPickerStateContext.Provider value={{ color, colorRef, update, commit, alpha, disabled, size: resolvedSize, variant, rtl, format, setFormat }}>
    <div
      role="group"
      data-slot="color-picker"
      data-orientation={orientation}
      data-size={resolvedSize}
      data-disabled={disabled ? "" : undefined}
      aria-label={ariaLabel ?? (ariaLabelledby ? undefined : strings.colorPicker)}
      aria-labelledby={ariaLabelledby}
      aria-disabled={disabled || undefined}
      className={cn("flex w-full max-w-xs flex-col gap-3", className)}
      {...props}
    >
      {children ?? (vertical ? (
        <>
          <div className="flex gap-4">
            {area}
            {hue}
            {alphaSlider}
          </div>
          <div className="flex items-center gap-2">
            {preview}
            <ColorPickerEyeDropper />
          </div>
          <div>
            {field}
          </div>
        </>
      ) : (
        <>
          {area}
          <div className="flex items-center gap-2">
            <div className="me-1 flex min-w-0 flex-1 flex-col gap-1">
              {hue}
              {alphaSlider}
            </div>
            {preview}
            <ColorPickerEyeDropper />
          </div>
          {field}
        </>
      ))}
      {swatches?.length ? (
        <ColorPickerSwatches
          swatches={swatches}
          hex={hex}
          alpha={alpha}
          size={resolvedSize}
          label={strings.colorSwatches}
          disabled={disabled}
          onChange={(next) => {
            update(keepHue(next, colorRef.current))
            commit()
          }}
        />
      ) : null}
      {name ? <input ref={hiddenRef} type="hidden" name={name} value={hex} disabled={disabled} form={form} /> : null}
    </div>
    </ColorPickerStateContext.Provider>
  )
}

/** The saturation (across) and brightness (up) area: one thumb holding two range inputs, as React Aria's ColorArea. */
function ColorAreaControl({
  color,
  rtl,
  disabled,
  saturationLabel,
  brightnessLabel,
  format,
  onChange,
  onCommit,
  className,
}: {
  className?: string
  color: Hsva
  rtl: boolean
  disabled: boolean
  saturationLabel: string
  brightnessLabel: string
  format: (n: number) => string
  onChange: (s: number, v: number) => void
  onCommit: () => void
}) {
  const xRef = React.useRef<HTMLInputElement>(null)
  const yRef = React.useRef<HTMLInputElement>(null)
  // Only one of the two inputs is a tab stop: the one used last, saturation at first.
  const [axis, setAxis] = React.useState<"x" | "y">("x")

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = pointerRatio(event, event.currentTarget, rtl)
    onChange(Math.round(x * 100), Math.round((1 - y) * 100))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const step = event.shiftKey ? 10 : 1
    let { s, v } = color
    let focus: "x" | "y" = "x"
    switch (event.key) {
      case "ArrowRight":
        s += rtl ? -step : step
        break
      case "ArrowLeft":
        s += rtl ? step : -step
        break
      case "ArrowUp":
        v += step
        focus = "y"
        break
      case "ArrowDown":
        v -= step
        focus = "y"
        break
      case "PageUp":
        v += 10
        focus = "y"
        break
      case "PageDown":
        v -= 10
        focus = "y"
        break
      case "Home":
        s -= 10
        break
      case "End":
        s += 10
        break
      default:
        return
    }
    event.preventDefault()
    // Arrow keys move from whole number to whole number, wherever a pointer left the thumb.
    const snap = (n: number, moved: boolean) => (moved ? clamp(Math.round(n), 0, 100) : n)
    onChange(snap(s, s !== color.s), snap(v, v !== color.v))
    onCommit()
    setAxis(focus)
    ;(focus === "x" ? xRef : yRef).current?.focus()
  }

  const inputClass = "sr-only"

  return (
    <div
      data-slot="color-picker-area"
      className={cn(
        "relative aspect-4/3 w-full min-w-0 cursor-pointer touch-none rounded-lg inset-ring inset-ring-color-picker-edge forced-color-adjust-none select-none",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to ${rtl ? "left" : "right"}, #fff, transparent), hsl(${Math.round(color.h)} 100% 50%)`,
      }}
      onPointerDown={(event) => {
        if (disabled || event.button !== 0) return
        event.preventDefault()
        event.currentTarget.setPointerCapture?.(event.pointerId)
        fromPointer(event)
        setAxis("x")
        xRef.current?.focus({ preventScroll: true })
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) fromPointer(event)
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      // A drag ends when the capture does: on release, or when the browser cancels the pointer (a touch taken over).
      onLostPointerCapture={onCommit}
    >
      <div
        data-slot="color-picker-area-thumb"
        className={cn(THUMB, "-translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2")}
        style={{ insetInlineStart: `${color.s}%`, top: `${100 - color.v}%`, background: rgbCss(color) }}
      >
        <input
          ref={xRef}
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(color.s)}
          aria-label={saturationLabel}
          aria-valuetext={format(color.s)}
          tabIndex={axis === "x" ? 0 : -1}
          disabled={disabled}
          className={inputClass}
          onFocus={() => setAxis("x")}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            onChange(Number(event.target.value), color.v)
            onCommit()
          }}
        />
        <input
          ref={yRef}
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(color.v)}
          aria-label={brightnessLabel}
          aria-valuetext={format(color.v)}
          aria-orientation="vertical"
          tabIndex={axis === "y" ? 0 : -1}
          disabled={disabled}
          className={inputClass}
          onFocus={() => setAxis("y")}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            onChange(color.s, Number(event.target.value))
            onCommit()
          }}
        />
      </div>
    </div>
  )
}

/** A hue or alpha slider: a gradient track with one thumb holding a range input. */
function ColorSliderControl({
  channel,
  label,
  value,
  max,
  step = 1,
  className,
  valueText,
  background,
  thumbColor,
  vertical,
  rtl,
  disabled,
  onChange,
  onCommit,
}: {
  channel: ColorChannel
  label: string
  value: number
  max: number
  step?: number
  className?: string
  valueText: string
  background: string
  thumbColor: string
  vertical: boolean
  rtl: boolean
  disabled: boolean
  onChange: (value: number) => void
  onCommit: () => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const ratio = value / max

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = pointerRatio(event, event.currentTarget, rtl && !vertical)
    onChange(Math.round((vertical ? 1 - y : x) * max / step) * step)
  }

  return (
    <div
      data-slot="color-picker-slider"
      data-channel={channel}
      data-orientation={vertical ? "vertical" : "horizontal"}
      className={cn(
        "relative shrink-0 cursor-pointer touch-none rounded-sm inset-ring inset-ring-color-picker-edge forced-color-adjust-none select-none",
        vertical ? "w-4 self-stretch" : "h-4 w-full",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      style={{ background }}
      onPointerDown={(event) => {
        if (disabled || event.button !== 0) return
        event.preventDefault()
        event.currentTarget.setPointerCapture?.(event.pointerId)
        fromPointer(event)
        inputRef.current?.focus({ preventScroll: true })
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) fromPointer(event)
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      // A drag ends when the capture does: on release, or when the browser cancels the pointer (a touch taken over).
      onLostPointerCapture={onCommit}
    >
      <div
        data-slot="color-picker-slider-thumb"
        className={cn(THUMB, vertical ? "start-0 translate-y-1/2" : "top-0 -translate-x-1/2 rtl:translate-x-1/2")}
        style={vertical ? { bottom: `${ratio * 100}%`, background: thumbColor } : { insetInlineStart: `${ratio * 100}%`, background: thumbColor }}
      >
        <input
          ref={inputRef}
          type="range"
          min={0}
          max={max}
          step={step}
          value={Math.round(value / step) * step}
          aria-label={label}
          aria-valuetext={valueText}
          aria-orientation={vertical ? "vertical" : "horizontal"}
          disabled={disabled}
          className="sr-only"
          onKeyDown={(event) => {
            const move = sliderKey(event, rtl && !vertical)
            if (move === null) return
            event.preventDefault()
            const next = move === "min" ? 0 : move === "max" ? max : Math.round(value / step) * step + move * step
            onChange(clamp(next, 0, max))
            onCommit()
          }}
          onChange={(event) => {
            onChange(Number(event.target.value))
            onCommit()
          }}
        />
      </div>
    </div>
  )
}

/** The preset colours: a radio group of swatches, the one matching the colour chosen. */
function ColorPickerSwatches({
  swatches,
  hex,
  alpha,
  size,
  label,
  disabled,
  onChange,
}: {
  swatches: NonNullable<ColorPickerProps["swatches"]>
  hex: string
  alpha: boolean
  size: ControlSize
  label: string
  disabled: boolean
  onChange: (color: Hsva) => void
}) {
  // A swatch that is not a hex colour is left out, and so is a second swatch of the same colour.
  const seen = new Set<string>()
  const items = swatches.flatMap((swatch) => {
    const parsed = parseHex(typeof swatch === "string" ? swatch : swatch.value)
    if (!parsed) return []
    const color = alpha ? parsed : { ...parsed, a: 100 }
    const value = toHex(color, alpha)
    if (seen.has(value)) return []
    seen.add(value)
    return [{ color, value, label: typeof swatch === "string" ? undefined : swatch.label }]
  })
  const current = items.some((item) => item.value === hex) ? hex : null

  return (
    <RadioGroupPrimitive.Root
      data-slot="color-picker-swatches"
      aria-label={label}
      value={current}
      disabled={disabled}
      onValueChange={(next) => {
        const item = items.find((i) => i.value === next)
        if (item) onChange(item.color)
      }}
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => (
        <RadioGroupPrimitive.Item
          key={item.value}
          value={item.value}
          aria-label={item.label ?? item.value}
          data-slot="color-picker-swatch"
          data-size={size}
          className={cn(
            // A swatch is the colour over the checks, a 1px `--border` edge inside; the chosen one has a 2px `--ring`
            // ring 2px away, and focus the 1px `--ring` outline.
            "relative size-6 shrink-0 cursor-pointer overflow-hidden rounded-md inset-ring inset-ring-color-picker-edge transition-[box-shadow,outline-color] duration-(--bui-duration-control) outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:cursor-not-allowed disabled:opacity-60 data-[size=lg]:size-7 data-[size=sm]:size-5 data-[state=checked]:ring-2 data-[state=checked]:ring-ring data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background"
          )}
          style={{ background: `linear-gradient(${rgbCss(item.color, item.color.a)}, ${rgbCss(item.color, item.color.a)}), ${CHECKS}` }}
        />
      ))}
    </RadioGroupPrimitive.Root>
  )
}

/**
 * A square of colour, over light checks so transparency shows. Decorative unless given an `aria-label`.
 *
 * @since 0.1.1
 */
function ColorSwatch({
  color,
  className,
  style,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"span">, "color"> & {
  /** Any CSS colour: `#3b82f6`, `#3b82f680`, `rgb(…)`. */
  color: string
}) {
  return (
    <span
      data-slot="color-swatch"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("relative inline-block size-9 shrink-0 overflow-hidden rounded-md inset-ring inset-ring-color-picker-edge forced-color-adjust-none", className)}
      style={{ background: `linear-gradient(${color}, ${color}), ${CHECKS}`, ...style }}
      {...props}
    />
  )
}

const triggerSizes: Record<ControlSize, string> = {
  sm: "size-7",
  default: "size-9",
  lg: "size-10.5",
}

/**
 * A swatch button that opens a `ColorPicker` in a popover. It takes the picker's props, and the popover's `open`,
 * `defaultOpen` and `onOpenChange`.
 *
 * @since 0.1.1
 */
function ColorPickerPopover({
  value,
  defaultValue = "#000000",
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  align = "start",
  side,
  size,
  alpha = true,
  disabled = false,
  name,
  form,
  className,
  "aria-label": ariaLabel,
  ...props
}: ColorPickerProps & {
  /** Whether the popover is open, when you control it. */
  open?: boolean
  /** Whether the popover starts open. */
  defaultOpen?: boolean
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** The popover's alignment against the swatch. `start` by default. */
  align?: React.ComponentProps<typeof PopoverContent>["align"]
  /** The side of the swatch the popover opens on. Below by default. */
  side?: React.ComponentProps<typeof PopoverContent>["side"]
}) {
  const strings = useUiStrings()
  const resolvedSize = useControlSize(size)
  const [inner, setInner] = React.useState(defaultValue)
  // The swatch, its name and the submitted value show the colour as the picker does: as hex, black when it is not one.
  const hex = toHex(parseColor(value ?? inner) ?? BLACK, alpha)
  const label = ariaLabel ?? strings.colorPicker

  const change = (next: string) => {
    if (value === undefined) setInner(next)
    onValueChange?.(next)
  }

  // A form's reset puts an uncontrolled picker back to its `defaultValue`.
  const hiddenRef = React.useRef<HTMLInputElement>(null)
  const controlled = value !== undefined
  useFormReset(hiddenRef, () => setInner(defaultValue), { enabled: !controlled, form })

  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger
        data-slot="color-picker-trigger"
        data-size={resolvedSize}
        disabled={disabled}
        className={cn(
          "inline-flex shrink-0 cursor-pointer rounded-md transition-[outline-color] duration-(--bui-duration-control) outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:cursor-not-allowed disabled:opacity-60",
          triggerSizes[resolvedSize],
          className
        )}
      >
        <ColorSwatch color={hex} className="size-full" />
        <span className="sr-only">
          {label} {hex}
        </span>
      </PopoverTrigger>
      <PopoverContent align={align} side={side} aria-label={label} className="w-72 p-3">
        <ColorPicker
          value={hex}
          onValueChange={change}
          size={resolvedSize}
          alpha={alpha}
          disabled={disabled}
          aria-label={label}
          className="max-w-none"
          {...props}
        />
      </PopoverContent>
      {name ? <input ref={hiddenRef} type="hidden" name={name} value={hex} disabled={disabled} form={form} /> : null}
    </Popover>
  )
}

export { ColorPicker, ColorPickerPopover, ColorSwatch, ColorPickerArea, ColorPickerSlider, ColorPickerInput, ColorPickerFormatSelect, ColorPickerEyeDropper, ColorPickerPreview }
export type { ColorFormat, ColorChannel }

// boolean-ui patch: shared colour state lets applications compose channel controls without duplicating conversion,
// controlled-value, disabled, form or commit behavior. Omitting children renders the complete picker recipe.
interface ColorPickerState {
  color: Hsva
  colorRef: React.RefObject<Hsva>
  update: (color: Hsva) => void
  commit: () => void
  alpha: boolean
  disabled: boolean
  size: ControlSize
  variant?: FieldVariant
  rtl: boolean
  format: ColorFormat
  setFormat: (format: ColorFormat) => void
}
const ColorPickerStateContext = React.createContext<ColorPickerState | null>(null)
function useColorPicker() {
  const context = React.useContext(ColorPickerStateContext)
  if (!context) throw new Error("ColorPicker parts must be inside ColorPicker")
  return context
}

/** A saturation and brightness area connected to its enclosing picker. @since 0.1.1 */
function ColorPickerArea({ className }: { className?: string }) {
  const { color, colorRef, update, commit, disabled, rtl } = useColorPicker()
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const percent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 })
  return <ColorAreaControl className={className} color={color} disabled={disabled} rtl={rtl} saturationLabel={strings.saturation} brightnessLabel={strings.brightness} format={(n) => percent.format(n / 100)} onChange={(s, v) => update({ ...colorRef.current, s, v })} onCommit={commit} />
}

/** A named channel slider; format selects HSL/HSV/OKLCH interpretation. @since 0.1.1 */
function ColorPickerSlider({ channel, format: formatProp, orientation = "horizontal", className }: {
  channel: ColorChannel
  format?: ColorFormat
  orientation?: "horizontal" | "vertical"
  className?: string
}) {
  const state = useColorPicker()
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const format = formatProp ?? state.format
  const range = channelRange(channel, format)
  const value = channelValue(state.color, channel, format)
  const vertical = orientation === "vertical"
  const direction = vertical ? "top" : state.rtl ? "left" : "right"
  // Intermediate stops preserve hue/saturation paths that cannot be represented by two RGB endpoints.
  const stops = Array.from({ length: 13 }, (_, i) => {
    const color = channel === "hue" && format !== "oklcha"
      ? { h: range.max * i / 12, s: 100, v: 100, a: 100 }
      : withChannel(state.color, channel, range.max * i / 12, format)
    return `${rgbCss(color, channel === "alpha" ? color.a : 100)} ${i / 12 * 100}%`
  })
  const valueText = new Intl.NumberFormat(locale, channel === "hue" ? { style: "unit", unit: "degree", unitDisplay: "narrow", maximumFractionDigits: 0 } : ["saturation", "brightness", "lightness", "alpha"].includes(channel) ? { style: "percent", maximumFractionDigits: 0 } : { maximumFractionDigits: 3 }).format(["saturation", "brightness", "lightness"].includes(channel) && !(channel === "lightness" && format === "oklcha") ? value / 100 : value)
  return <ColorSliderControl channel={channel} label={strings[channel]} value={value} max={range.max} step={range.step} valueText={valueText} background={`linear-gradient(to ${direction}, ${stops.join(", ")})${channel === "alpha" ? `, ${CHECKS}` : ""}`} thumbColor={channel === "hue" && format !== "oklcha" ? `hsl(${state.color.h} 100% 50%)` : rgbCss(state.color)} vertical={vertical} rtl={state.rtl} disabled={state.disabled || (channel === "alpha" && !state.alpha)} onChange={(next) => state.update(withChannel(state.colorRef.current, channel, next, format))} onCommit={state.commit} className={className} />
}

/** An editable hex/CSS value or individual channel; numbers use degrees, 0–255 RGB, 0–1 alpha/OKLCH lightness and 0–100 HSL/HSB. @since 0.1.1 */
/**
 * boolean-ui patch: a number cell of the attached channel row is centred, 6px from its edges, without the browser's spin
 * buttons, so four values ("255", "0.75") fit the row beside the format select (stock: no channel fields).
 */
const channelCell =
  "px-1.5 text-center rtl:text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

function ColorPickerInput({ channel = "hex", format: formatProp, grouped = false, className }: {
  channel?: ColorChannel | "hex" | "css"
  /** Removes the individual border inside an attached InputGroup. */
  grouped?: boolean
  format?: ColorFormat
  className?: string
}) {
  const state = useColorPicker()
  const strings = useUiStrings()
  const format = formatProp ?? state.format
  const numeric = channel !== "hex" && channel !== "css"
  const [draft, setDraft] = React.useState<string | null>(null)
  const shown = channel === "hex" ? toHex(state.color, state.alpha) : channel === "css" ? toOklchCss(state.color) : String(Number(channelValue(state.color, channel, format).toFixed(channel === "chroma" ? 4 : channel === "alpha" || (channel === "hue" && format === "oklcha") ? 2 : channel === "lightness" && format === "oklcha" ? 3 : 0)))
  const settle = () => {
    if (draft === null) return
    setDraft(null)
    state.commit()
  }
  const Control = grouped ? InputGroupInput : Input
  return <Control data-slot={grouped ? "input-group-control" : "color-picker-input"} data-channel={channel} aria-label={channel === "hex" ? strings.hexColor : channel === "css" ? strings.cssColor : strings[channel]} {...(!grouped ? { size: state.size, variant: state.variant } : {})} disabled={state.disabled || (channel === "alpha" && !state.alpha)} spellCheck={false} autoComplete="off" type={numeric ? "number" : "text"} min={numeric ? 0 : undefined} max={numeric ? channelRange(channel, format).max : undefined} step={numeric ? channelRange(channel, format).step : undefined} inputMode={numeric ? "decimal" : "text"} maxLength={channel === "hex" ? 9 : undefined} value={draft ?? shown} dir="ltr" className={cn("min-w-0 flex-1 rtl:text-end", numeric && grouped && channelCell, className)} onChange={(event) => {
    const text = event.target.value
    setDraft(text)
    if (numeric) {
      if (!text.trim()) return
      const value = Number(text)
      if (Number.isFinite(value)) state.update(withChannel(state.colorRef.current, channel, value, format))
    } else {
      const parsed = channel === "hex" ? parseHex(text) : parseColor(text)
      if (parsed) state.update(keepHue({ ...parsed, a: state.alpha ? parsed.a : 100 }, state.colorRef.current))
    }
  }} onBlur={settle} onKeyDown={(event) => {
    if (event.key === "Enter") { event.preventDefault(); settle() }
    if (numeric) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") return
      const move = sliderKey(event, false)
      if (move === null) return
      event.preventDefault()
      const range = channelRange(channel, format)
      const next = move === "min" ? 0 : move === "max" ? range.max : channelValue(state.color, channel, format) + move * range.step
      setDraft(null)
      state.update(withChannel(state.colorRef.current, channel, next, format))
      state.commit()
    }
  }} />
}

/** Changes the displayed controls without changing the selected colour. @since 0.1.1 */
function ColorPickerFormatSelect({ className }: { className?: string }) {
  const state = useColorPicker()
  const strings = useUiStrings()
  return <Select value={state.format} onValueChange={(format) => state.setFormat(format as ColorFormat)} disabled={state.disabled}>
    <SelectTrigger data-slot="color-picker-format" aria-label={strings.colorFormat} size={state.size} variant={state.variant} className={cn("w-26 shrink-0", className)}><SelectValue /></SelectTrigger>
    <SelectContent>{Object.keys(colorChannels).map((format) => <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>)}</SelectContent>
  </Select>
}

/** The current colour, for a composed picker. @since 0.1.1 */
function ColorPickerPreview({ className, ...props }: Omit<React.ComponentProps<typeof ColorSwatch>, "color">) {
  const state = useColorPicker()
  return <ColorSwatch data-slot="color-picker-preview" color={toHex(state.color, state.alpha)} className={className} {...props} />
}

type EyeDropperConstructor = new () => { open: (options?: { signal: AbortSignal }) => Promise<{ sRGBHex: string }> }
const subscribeEyeDropper = () => () => {}
const supportsEyeDropper = () => typeof window !== "undefined" && typeof (window as Window & { EyeDropper?: EyeDropperConstructor }).EyeDropper === "function"

/** Uses the browser's screen colour picker when available in a secure context. @since 0.1.1 */
function ColorPickerEyeDropper({ className }: { className?: string }) {
  const state = useColorPicker()
  const strings = useUiStrings()
  const supported = React.useSyncExternalStore(subscribeEyeDropper, supportsEyeDropper, () => false)
  const [busy, setBusy] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const pending = React.useRef<AbortController | null>(null)
  React.useEffect(() => {
    return () => { pending.current?.abort(); pending.current = null }
  }, [])
  React.useEffect(() => { if (state.disabled) pending.current?.abort() }, [state.disabled])
  return <>
    <Button type="button" data-slot="color-picker-eyedropper" variant="outline" size={state.size === "default" ? "icon" : state.size === "sm" ? "icon-sm" : "icon-lg"} className={cn("text-field-placeholder", className)} aria-label={strings.pickColor} title={supported ? strings.pickColor : strings.eyeDropperUnavailable} disabled={state.disabled || !supported || busy} onClick={async () => {
      const EyeDropper = (window as Window & { EyeDropper?: EyeDropperConstructor }).EyeDropper
      if (!EyeDropper || pending.current) return
      const controller = new AbortController()
      pending.current = controller
      setBusy(true)
      setFailed(false)
      try {
        const result = await new EyeDropper().open({ signal: controller.signal })
        if (controller.signal.aborted) return
        const color = parseHex(result.sRGBHex)
        if (color) { state.update({ ...color, a: state.colorRef.current.a }); state.commit() }
      } catch (error) {
        if (!controller.signal.aborted && !(typeof error === "object" && error !== null && "name" in error && error.name === "AbortError")) setFailed(true)
      } finally {
        if (pending.current === controller) { pending.current = null; setBusy(false) }
      }
    }}><PipetteIcon aria-hidden="true" /></Button>
    {failed ? <span role="status" className="sr-only">{strings.eyeDropperFailed}</span> : null}
  </>
}
