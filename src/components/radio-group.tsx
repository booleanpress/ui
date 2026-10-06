"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { useControlSize, useFieldVariant, type ControlSize, type FieldVariant } from "@booleanpress/ui/provider"

// boolean-ui patch: the group hands its size and look to its radios (stock: no size or look).
const RadioGroupContext = React.createContext<{ size?: ControlSize; variant?: FieldVariant }>({})

/** @since 0.1.0 */
function RadioGroup({
  className,
  size,
  variant,
  orientation,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  /** The size of every radio in the group: 14, 18 or 20 px. Defaults to the provider's `controlSize`. @since 0.1.0 */
  size?: ControlSize
  /** The look of every radio in the group. Defaults to the provider's `fieldVariant`. @since 0.1.0 */
  variant?: FieldVariant
}) {
  const context = React.useMemo(() => ({ size, variant }), [size, variant])

  return (
    <RadioGroupContext.Provider value={context}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        orientation={orientation}
        className={cn("flex flex-wrap", orientation === "vertical" ? "flex-col gap-2" : "gap-4", className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  )
}

/** @since 0.1.0 */
function RadioGroupItem({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  /** A 14, 18 or 20 px circle. Defaults to the group's `size`, then the provider's `controlSize`. @since 0.1.0 */
  size?: ControlSize
  /** `filled` fills the unchosen circle grey. Defaults to the group's `variant`, then the provider's. @since 0.1.0 */
  variant?: FieldVariant
}) {
  const group = React.useContext(RadioGroupContext)
  const resolvedSize = useControlSize(size ?? group.size)
  const resolvedVariant = useFieldVariant(variant ?? group.variant)

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      className={cn(
        // boolean-ui patch: the BooleanPress look — an 18px circle on a solid `--field` fill, the `--control` edge darkening
        // on hover; chosen fills the circle `--primary` (one step lighter on hover) around a 10px `--primary-foreground` dot
        // (stock: a 16px transparent circle with an 8px `--primary` dot).
        "inline-flex aspect-square size-4.5 shrink-0 items-center justify-center rounded-full border border-control bg-field text-primary-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none enabled:hover:border-control-hover data-[state=checked]:border-primary data-[state=checked]:bg-primary enabled:data-[state=checked]:hover:border-primary-hover enabled:data-[state=checked]:hover:bg-primary-hover",
        // boolean-ui patch: focus is a 1px `--ring` outline 2px outside the circle (stock: a 3px ring at 50%).
        "focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring",
        // boolean-ui patch: invalid is the `--invalid` edge, chosen or not, with no ring (stock: the destructive edge and ring).
        "aria-invalid:border-invalid aria-invalid:data-[state=checked]:border-invalid",
        // boolean-ui patch: disabled keeps full opacity and fills `--field-disabled`, the dot in
        // `--field-disabled-foreground` (stock: 50% opacity).
        "disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-control disabled:bg-field-disabled disabled:text-foreground dark:disabled:text-field-disabled-foreground disabled:data-[state=checked]:border-control disabled:data-[state=checked]:bg-field-disabled dark:disabled:bg-field-disabled-foreground dark:disabled:data-[state=checked]:bg-field-disabled-foreground",
        // boolean-ui patch: sm is a 14px circle with an 8px dot, lg a 20px one with a 12px dot (stock: one size).
        "group/radio data-[size=sm]:size-3.5 data-[size=lg]:size-5",
        // boolean-ui patch: filled is the grey `--field-filled` circle while not chosen (stock: no variant).
        "data-[variant=filled]:enabled:data-[state=unchecked]:bg-field-filled",
        className
      )}
      {...props}
    >
      {/* boolean-ui patch: keep the decorative dot mounted so checking and unchecking animate its fill and scale. */}
      <RadioGroupPrimitive.Indicator
        forceMount
        aria-hidden="true"
        data-slot="radio-group-indicator"
        className="size-2.5 scale-10 rounded-full bg-transparent forced-color-adjust-none transition-[background-color,scale] duration-(--bui-duration-control) data-[state=checked]:scale-100 data-[state=checked]:bg-current group-data-[size=sm]/radio:size-2 group-data-[size=lg]/radio:size-3"
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
