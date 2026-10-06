"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { useControlSize, useFieldVariant, type ControlSize, type FieldVariant } from "@booleanpress/ui/provider"

// boolean-ui patch: a custom mark takes the size of the built-in marks (stock: no custom mark).
const MARK =
  "grid place-content-center [&>svg]:size-3.5 group-data-[size=sm]/checkbox:[&>svg]:size-2.5 group-data-[size=lg]/checkbox:[&>svg]:size-4"

/**
 * A box people tick to choose one or more options, or to mix (`checked="indeterminate"`) when a group is partly
 * chosen. Give it a name with a `Label htmlFor`, or put it in a horizontal `Field`.
 *
 * @since 0.1.1
 */
function Checkbox({
  className,
  size,
  variant,
  icon,
  indeterminateIcon,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  /** A 14, 18 or 20 px box. Defaults to the provider's `controlSize`. @since 0.1.1 */
  size?: ControlSize
  /** `filled` fills the unchecked box grey. Defaults to the provider's `fieldVariant`. @since 0.1.1 */
  variant?: FieldVariant
  /** The mark shown when checked, in place of the check. Sized with the box. @since 0.1.1 */
  icon?: React.ReactNode
  /** The mark shown when mixed, in place of the dash. Sized with the box. @since 0.1.1 */
  indeterminateIcon?: React.ReactNode
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      className={cn(
        // boolean-ui patch: the BooleanPress look — an 18px box with a 4px radius on a solid `--field` fill, the `--control`
        // edge darkening on hover; checked fills `--primary` (one step lighter on hover); the mixed state keeps the
        // unfilled box with a dash in `--foreground`, as the visual target draws it (stock: a 16px transparent box; spec 003
        // filled the mixed state).
        "group/checkbox peer size-4.5 shrink-0 rounded-sm border border-control bg-field text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none enabled:hover:border-control-hover data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground enabled:data-[state=checked]:hover:border-primary-hover enabled:data-[state=checked]:hover:bg-primary-hover",
        // boolean-ui patch: focus is a 1px `--ring` outline 2px outside the box (stock: a 3px ring at 50%).
        "focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring",
        // boolean-ui patch: invalid is the `--invalid` edge, checked or not, with no ring (stock: the destructive edge and ring).
        "aria-invalid:border-invalid aria-invalid:data-[state=checked]:border-invalid",
        // boolean-ui patch: disabled keeps full opacity and fills `--field-disabled`, the mark in
        // `--field-disabled-foreground`, checked or not (stock: 50% opacity).
        "disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-control dark:disabled:border-control-hover disabled:bg-field-disabled disabled:text-foreground dark:disabled:text-field-disabled-foreground disabled:data-[state=checked]:border-control disabled:data-[state=checked]:bg-field-disabled disabled:data-[state=checked]:text-foreground dark:disabled:data-[state=checked]:text-field-disabled-foreground",
        // boolean-ui patch: sm is a 14px box, lg a 20px one, with the same 4px radius (stock: one size).
        "data-[size=sm]:size-3.5 data-[size=lg]:size-5",
        // boolean-ui patch: filled is the grey `--field-filled` box while not checked (stock: no variant).
        "data-[variant=filled]:enabled:not-data-[state=checked]:bg-field-filled",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        {/* boolean-ui patch: a dash for the mixed state (stock shows the check mark for both), spec 003; both marks are
            14px, 10px in sm and 16px in lg; `icon` and `indeterminateIcon` replace
            them, sized the same way. */}
        {icon != null ? (
          <span data-slot="checkbox-icon" className={cn(MARK, "group-data-[state=indeterminate]/checkbox:hidden")}>
            {icon}
          </span>
        ) : (
          <CheckIcon className="size-3.5 group-data-[size=sm]/checkbox:size-2.5 group-data-[size=lg]/checkbox:size-4 group-data-[state=indeterminate]/checkbox:hidden" />
        )}
        {indeterminateIcon != null ? (
          <span data-slot="checkbox-icon" className={cn(MARK, "hidden group-data-[state=indeterminate]/checkbox:grid")}>
            {indeterminateIcon}
          </span>
        ) : (
          <MinusIcon className="hidden size-3.5 group-data-[size=sm]/checkbox:size-2.5 group-data-[size=lg]/checkbox:size-4 group-data-[state=indeterminate]/checkbox:block" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
