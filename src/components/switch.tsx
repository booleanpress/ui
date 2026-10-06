"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch as SwitchPrimitive } from "radix-ui"

import { useControlSize, type ControlSize } from "@booleanpress/ui/provider"

/** @since 0.1.1 */
function Switch({
  className,
  size,
  checkedIcon,
  uncheckedIcon,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /** 28 × 16, 36 × 22 or 44 × 26 px. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** An icon inside the thumb while on, such as a check. Sized with the thumb. @since 0.1.1 */
  checkedIcon?: React.ReactNode
  /** An icon inside the thumb while off, such as a cross. Sized with the thumb. @since 0.1.1 */
  uncheckedIcon?: React.ReactNode
}) {
  const resolvedSize = useControlSize(size)

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={resolvedSize}
      className={cn(
        // boolean-ui patch: the BooleanPress look — a 36 × 22px track (sm 28 × 16px), off in `--control`, on in `--primary`,
        // each one step darker or lighter on hover; disabled fills the track `--field-disabled` at full opacity (stock:
        // 32 × 18px, no hover, 50% opacity).
        "peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none data-[size=default]:h-5.5 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7 data-[state=checked]:bg-primary data-[state=unchecked]:bg-control enabled:hover:data-[state=checked]:bg-primary-hover enabled:hover:data-[state=unchecked]:bg-control-hover",
        // boolean-ui patch: focus is a 1px `--ring` outline 2px outside the track (stock: a 3px ring at 50%).
        "focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring",
        // boolean-ui patch: invalid draws the `--invalid` edge round the track (stock: no invalid style).
        "aria-invalid:border-invalid",
        "disabled:cursor-not-allowed disabled:data-[state=checked]:bg-field-disabled disabled:data-[state=unchecked]:bg-field-disabled dark:disabled:data-[state=checked]:bg-control-hover dark:disabled:data-[state=unchecked]:bg-control-hover",
        // boolean-ui patch: lg is a 44 × 26px track (stock: no lg).
        "data-[size=lg]:h-6.5 data-[size=lg]:w-11",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // boolean-ui patch: a 14px knob (sm 10px) 4px from the track's ends (sm 3px), `--card` on either state with the
          // off knob `--muted-foreground` in dark; disabled, `--field-disabled-foreground` in light and `--card` in dark
          // (stock: a 16px knob flush with the ends, `--background`, `--foreground` off in dark).
          "pointer-events-none block rounded-full bg-card ring-0 transition-[translate,background-color] duration-(--bui-duration-control) group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-2.5 group-disabled/switch:bg-foreground dark:group-enabled/switch:data-[state=unchecked]:bg-muted-foreground dark:group-disabled/switch:bg-card",
          "group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0.75 group-data-[size=default]/switch:data-[state=checked]:translate-x-4.25 group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0.5 group-data-[size=sm]/switch:data-[state=checked]:translate-x-3.5",
          "rtl:group-data-[size=default]/switch:data-[state=unchecked]:-translate-x-0.75 rtl:group-data-[size=default]/switch:data-[state=checked]:-translate-x-4.25 rtl:group-data-[size=sm]/switch:data-[state=unchecked]:-translate-x-0.5 rtl:group-data-[size=sm]/switch:data-[state=checked]:-translate-x-3.5",
          // boolean-ui patch: lg has an 18px knob 4px from the track's ends (stock: no lg).
          "group-data-[size=lg]/switch:size-4.5 group-data-[size=lg]/switch:data-[state=unchecked]:translate-x-0.75 group-data-[size=lg]/switch:data-[state=checked]:translate-x-5.25 rtl:group-data-[size=lg]/switch:data-[state=unchecked]:-translate-x-0.75 rtl:group-data-[size=lg]/switch:data-[state=checked]:-translate-x-5.25",
          // boolean-ui patch: knob icons use the field placeholder colour off (`--card` in dark), primary on.
          // Disabled keeps the icon colour of its checked state (stock: no icon).
          (checkedIcon != null || uncheckedIcon != null) &&
            "flex items-center justify-center text-field-placeholder data-[state=checked]:text-primary dark:data-[state=unchecked]:text-card [&_svg]:size-full"
        )}
      >
        {checkedIcon != null ? (
          <span data-slot="switch-icon" className="hidden size-full group-data-[state=checked]/switch:flex">
            {checkedIcon}
          </span>
        ) : null}
        {uncheckedIcon != null ? (
          <span data-slot="switch-icon" className="hidden size-full group-data-[state=unchecked]/switch:flex">
            {uncheckedIcon}
          </span>
        ) : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
