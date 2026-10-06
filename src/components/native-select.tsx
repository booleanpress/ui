"use client"
// boolean-ui patch: a client module, as it reads the provider's size and look (stock: no directive).

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

import { useControlSize, useFieldVariant, type ControlSize, type FieldVariant } from "@booleanpress/ui/provider"

/** @since 0.1.1 */
function NativeSelect({
  className,
  size,
  variant,
  fluid = false,
  ...props
}: Omit<React.ComponentProps<"select">, "size"> & {
  /** 28, 35 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. @since 0.1.1 */
  variant?: FieldVariant
  /** Fills the width of its container. @since 0.1.1 */
  fluid?: boolean
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)

  return (
    <div
      // boolean-ui patch: no opacity on the wrapper; a disabled select draws the disabled field colours (stock: 50% opacity).
      // `fluid` widens it to its container (stock: no prop).
      className={cn("group/native-select relative w-fit", fluid && "w-full")}
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        data-size={resolvedSize}
        data-variant={resolvedVariant}
        className={cn(
          // boolean-ui patch: the BooleanPress field look, as Input — 35px tall from 6px × 10px padding and a 21px line
          // (sm 28px: 4px × 8px, 12px text), a solid `--field` fill, the `--control` edge darkening on hover, a 36px chevron
          // column at the end; disabled fills `--field-disabled` (stock: 36px and 32px fixed heights, transparent fill).
          "w-full min-w-0 appearance-none rounded-md border border-control bg-field py-1.5 ps-2.5 pe-11.5 text-sm/normal text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground hover:border-control-hover disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-field-disabled disabled:text-field-disabled-foreground data-[size=sm]:py-1 data-[size=sm]:ps-2 data-[size=sm]:pe-11 data-[size=sm]:text-xs/normal",
          // boolean-ui patch: lg is 42px from 8px × 12px padding and a 24px line of 16px text, with a 48px end column
          // (stock: no lg).
          "data-[size=lg]:py-2 data-[size=lg]:ps-3 data-[size=lg]:pe-12 data-[size=lg]:text-base/normal",
          // boolean-ui patch: filled is the grey `--field-filled` fill, kept on hover and focus (stock: no variant).
          "data-[variant=filled]:enabled:bg-field-filled",
          // boolean-ui patch: focus turns the edge `--ring`, with no ring around it (stock: a 3px ring at 50%).
          "focus-visible:border-ring",
          // boolean-ui patch: invalid is the `--invalid` edge with no ring; focus still shows `--ring` (stock: the
          // destructive edge and ring).
          "aria-invalid:border-invalid aria-invalid:focus-visible:border-ring",
          className
        )}
        {...props}
      />
      {/* boolean-ui patch: a 14px chevron (sm 12px, lg 16px) centred in the 36px end column, in the field-icon colour
          (stock: 16px, the muted colour at 50%). */}
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 end-3 size-3.5 -translate-y-1/2 text-control-hover select-none group-has-[[data-size=sm]]/native-select:end-3.25 group-has-[[data-size=sm]]/native-select:size-3 group-has-[[data-size=lg]]/native-select:end-2.75 group-has-[[data-size=lg]]/native-select:size-4"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

/** @since 0.1.1 */
function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
