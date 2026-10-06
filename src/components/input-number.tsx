// InputNumber: built on Base UI's Number Field (`@base-ui/react/number-field`), with the library's field look.
"use client"

import * as React from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useFormReset } from "@/lib/form-reset"
import { cn } from "@/lib/utils"

import {
  useControlSize,
  useFieldVariant,
  useUiConfig,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

type RootProps = React.ComponentProps<typeof NumberFieldPrimitive.Root>
type InputProps = React.ComponentProps<typeof NumberFieldPrimitive.Input>

/** Where the stepper buttons go: stacked at the end, on both sides, or above and below. @since 0.1.0 */
type InputNumberButtons = "stacked" | "horizontal" | "vertical"

// The text's padding by size, as Input's; stacked buttons add their 36px column to the end padding.
const inputPaddings: Record<ControlSize, string> = {
  sm: "px-2 py-1 text-xs",
  default: "px-2.5 py-1.5 text-sm",
  lg: "px-3 py-2 text-base",
}
const stackedEndPaddings: Record<ControlSize, string> = { sm: "pe-9", default: "pe-9", lg: "pe-9" }
const iconSizes: Record<ControlSize, string> = { sm: "size-2.5", default: "size-2.5", lg: "size-2.5" }

// A stepper button: transparent, in the field-icon colour; a slate fill under the pointer and a darker one while pressed.
// boolean-ui patch: compact steppers share the field surface and allow caller-supplied icons.
const stepperBase =
  "[&>svg]:size-2.5 flex shrink-0 cursor-pointer items-center justify-center bg-field text-field-placeholder transition-[color,background-color,border-color,outline-color] duration-(--bui-duration-control) outline-none select-none enabled:hover:bg-accent enabled:hover:text-foreground enabled:active:bg-secondary-hover enabled:active:text-secondary-foreground dark:enabled:active:text-secondary-hover-foreground disabled:cursor-not-allowed disabled:opacity-60 group-data-disabled/input-number:opacity-100"

const stepperLayouts: Record<InputNumberButtons, { increment: string; decrement: string }> = {
  // Inside the field's edge, one above the other, 36px wide.
  stacked: {
    increment: "w-8 flex-1 rounded-se-[5px]",
    decrement: "w-8 flex-1 rounded-ee-[5px]",
  },
  // Either side of the field, with the field's edge.
  horizontal: {
    increment:
      "order-3 w-8 rounded-e-md border border-s-0 border-control group-has-[[aria-invalid=true]]/input-number:border-invalid group-data-disabled/input-number:bg-field-disabled",
    decrement:
      "order-1 w-8 rounded-s-md border border-e-0 border-control group-has-[[aria-invalid=true]]/input-number:border-invalid group-data-disabled/input-number:bg-field-disabled",
  },
  // boolean-ui patch: above and below a 40px field, with 4px input padding; buttons fill its width.
  vertical: {
    increment:
      "order-1 w-full rounded-t-md border border-b-0 border-control p-1 group-has-[[aria-invalid=true]]/input-number:border-invalid group-data-disabled/input-number:bg-field-disabled",
    decrement:
      "order-3 w-full rounded-b-md border border-t-0 border-control p-1 group-has-[[aria-invalid=true]]/input-number:border-invalid group-data-disabled/input-number:bg-field-disabled",
  },
}

/**
 * A number field: typing, the arrow keys and the stepper buttons change a number, shown in the provider's locale
 * (`1,234.5` in English, `1.234,5` in German) and kept between `min` and `max`.
 *
 * @since 0.1.0
 */
function InputNumber({
  className,
  size,
  variant,
  fluid = false,
  buttons,
  incrementIcon,
  decrementIcon,
  prefix,
  suffix,
  locale,
  id,
  name,
  form,
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min,
  max,
  step,
  smallStep,
  largeStep,
  snapOnStep,
  allowWheelScrub,
  allowOutOfRange,
  format,
  disabled,
  readOnly,
  required,
  inputRef,
  onKeyDown,
  "aria-describedby": ariaDescribedBy,
  ...props
}: Omit<
  InputProps,
  | "className"
  | "render"
  | "size"
  | "prefix"
  | "value"
  | "defaultValue"
  | "onChange"
  | "type"
  | "min"
  | "max"
  | "step"
  | "name"
  | "form"
  | "id"
  | "disabled"
  | "readOnly"
  | "required"
> &
  Pick<
    RootProps,
    | "id"
    | "name"
    | "form"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "onValueCommitted"
    | "min"
    | "max"
    | "step"
    | "smallStep"
    | "largeStep"
    | "snapOnStep"
    | "allowWheelScrub"
    | "allowOutOfRange"
    | "format"
    | "disabled"
    | "readOnly"
    | "required"
    | "inputRef"
  > & {
    /** Classes for the outer box. */
    className?: string
    /** The field's size: 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. */
    size?: ControlSize
    /** `filled` draws the grey `--field-filled` fill. Defaults to the provider's `fieldVariant`. */
    variant?: FieldVariant
    /** Fills the width of its container. */
    fluid?: boolean
    /** Shows stepper buttons: `stacked` at the end, `horizontal` on both sides, `vertical` above and below. */
    buttons?: InputNumberButtons
    /** Replaces the stepper arrow; the control keeps its accessible name. */
    incrementIcon?: React.ReactNode
    decrementIcon?: React.ReactNode
    /** Text drawn inside the field before the number, such as a unit; read with the field as its description. */
    prefix?: React.ReactNode
    /** Text drawn inside the field after the number, such as a unit; read with the field as its description. */
    suffix?: React.ReactNode
    /** The locale the number is shown and read in. Defaults to the provider's `locale`. */
    locale?: Intl.LocalesArgument
  }) {
  const strings = useUiStrings()
  const resolvedSize = useControlSize(size)
  const { dir } = useUiConfig()
  const resolvedVariant = useFieldVariant(variant)
  const { locale: providerLocale } = useUiLocale()
  const prefixId = React.useId()
  const suffixId = React.useId()
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  // Base UI keeps the number in state, which a form reset cannot reach: an uncontrolled field starts again from its
  // `defaultValue` instead.
  const [resetCount, setResetCount] = React.useState(0)
  useFormReset(rootRef, () => setResetCount((count) => count + 1), { enabled: value === undefined, form })
  const describedBy = [ariaDescribedBy, prefix != null ? prefixId : null, suffix != null ? suffixId : null]
    .filter(Boolean)
    .join(" ")

  const handleKeyDown = (event: Parameters<NonNullable<InputProps["onKeyDown"]>>[0]) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || readOnly || disabled) return
    if (event.key !== "PageUp" && event.key !== "PageDown") return
    // Page Up and Page Down step by `largeStep`, as Shift with an arrow does: the field's own arrow handling does the step,
    // so clamping, snapping and the change reason stay its own.
    event.preventDefault()
    event.currentTarget.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: event.key === "PageUp" ? "ArrowUp" : "ArrowDown",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    )
  }

  const layout = buttons ?? null
  const iconClass = iconSizes[resolvedSize]

  const increment = layout ? (
    <NumberFieldPrimitive.Increment
      data-slot="input-number-increment"
      aria-label={strings.increment}
      className={cn(stepperBase, stepperLayouts[layout].increment)}
    >
      {incrementIcon ?? <ChevronUpIcon className={iconClass} />}
    </NumberFieldPrimitive.Increment>
  ) : null

  const decrement = layout ? (
    <NumberFieldPrimitive.Decrement
      data-slot="input-number-decrement"
      aria-label={strings.decrement}
      className={cn(stepperBase, stepperLayouts[layout].decrement)}
    >
      {decrementIcon ?? <ChevronDownIcon className={iconClass} />}
    </NumberFieldPrimitive.Decrement>
  ) : null

  return (
    // Base UI learns the provider's direction, so its own keys flip right to left.
    <DirectionProvider direction={dir}>
      <NumberFieldPrimitive.Root
        key={resetCount}
        ref={rootRef}
        data-slot="input-number"
        data-size={resolvedSize}
        data-variant={resolvedVariant}
        data-buttons={layout ?? undefined}
        id={id}
        name={name}
        form={form}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
        min={min}
        max={max}
        // Without a `step` of its own, the hidden input that carries the value for forms takes `any`: with `min` set, the
        // browser's step check would otherwise refuse a form holding a number between whole steps, such as 12.99. Typing,
        // the arrows and the buttons still step by 1.
        step={step ?? "any"}
        smallStep={smallStep}
        largeStep={largeStep}
        snapOnStep={snapOnStep}
        allowWheelScrub={allowWheelScrub}
        allowOutOfRange={allowOutOfRange}
        format={format}
        locale={locale ?? providerLocale}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        inputRef={inputRef}
        className={cn(
          "group/input-number relative inline-flex min-w-0 align-middle",
          layout === "vertical" && "w-10 flex-col",
          (layout === "horizontal" || layout === "vertical") && "items-stretch",
          fluid && "flex w-full",
          className
        )}
      >
        {layout === "horizontal" || layout === "vertical" ? decrement : null}
        <NumberFieldPrimitive.Group
          data-slot="input-number-field"
          // The field's look, round the number and its prefix and suffix: as Input's, edge, fill, hover, focus, invalid and
          // disabled; a click anywhere in it puts the caret in the number.
          className={cn(
            "relative order-2 flex min-w-0 cursor-text items-center rounded-md border border-control bg-field text-foreground shadow-(--bui-shadow-field) transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) hover:border-control-hover",
            "data-[variant=filled]:bg-field-filled",
            "has-[[data-slot=input-number-input]:focus-visible]:border-ring",
            "has-[[aria-invalid=true]]:border-invalid has-[[aria-invalid=true]]:has-[[data-slot=input-number-input]:focus-visible]:border-ring",
            "data-disabled:cursor-not-allowed data-disabled:border-control data-disabled:bg-field-disabled data-disabled:text-field-disabled-foreground data-disabled:opacity-60",
            (layout === "horizontal" || layout === "vertical") && "rounded-none",
            fluid && "flex-1"
          )}
          data-variant={resolvedVariant}
          onMouseDown={(event) => {
            if ((event.target as HTMLElement).closest("button, input")) return
            event.preventDefault()
            event.currentTarget.querySelector<HTMLInputElement>("[data-slot=input-number-input]")?.focus()
          }}
        >
          {prefix != null ? (
            <span
              id={prefixId}
              data-slot="input-number-prefix"
              className={cn("shrink-0 whitespace-nowrap select-none", inputPaddings[resolvedSize], "pe-0")}
            >
              {prefix}
            </span>
          ) : null}
          <NumberFieldPrimitive.Input
            data-slot="input-number-input"
            data-size={resolvedSize}
            aria-roledescription={strings.numberFieldRole}
            aria-describedby={describedBy || undefined}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-w-0 flex-auto bg-transparent text-inherit tabular-nums outline-none placeholder:text-field-placeholder disabled:cursor-not-allowed aria-invalid:placeholder:text-field-invalid-foreground",
              inputPaddings[resolvedSize],
              // A prefix or a suffix sits a space's width from the number.
              prefix != null && "ps-1",
              suffix != null && "pe-1",
              layout === "stacked" && suffix == null && stackedEndPaddings[resolvedSize],
              // A number reads left to right in every locale: on a right-to-left page its text keeps that order (unless it
              // holds right-to-left letters, such as an Arabic currency sign) while the field keeps the page's direction.
              "[unicode-bidi:plaintext]",
              layout === "vertical" ? "w-full px-1 text-center" : "rtl:text-right",
              fluid && layout !== "vertical" && "w-[1%]"
            )}
            {...props}
          />
          {suffix != null ? (
            <span
              id={suffixId}
              data-slot="input-number-suffix"
              className={cn(
                "shrink-0 whitespace-nowrap select-none",
                inputPaddings[resolvedSize],
                "ps-0",
                layout === "stacked" && stackedEndPaddings[resolvedSize]
              )}
            >
              {suffix}
            </span>
          ) : null}
          {layout === "stacked" ? (
            <span data-slot="input-number-buttons" className="absolute inset-y-0 end-0 flex flex-col">
              {increment}
              {decrement}
            </span>
          ) : null}
        </NumberFieldPrimitive.Group>
        {layout === "horizontal" || layout === "vertical" ? increment : null}
      </NumberFieldPrimitive.Root>
    </DirectionProvider>
  )
}

export { InputNumber }
export type { InputNumberButtons }
