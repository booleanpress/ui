"use client"

import * as React from "react"
import { cn, fillString } from "@/lib/utils"
import { type ControlSize, useControlSize, useUiStrings } from "@booleanpress/ui/provider"
import { Slider as SliderPrimitive } from "radix-ui"

/** @since 0.1.1 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  size,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  name,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** The track and handle: `sm` a 16px handle, `default` 20px, `lg` 24px. The provider's `controlSize` by default. */
  size?: ControlSize
}) {
  const resolved = useControlSize(size)
  const strings = useUiStrings()
  const baseId = React.useId()
  // boolean-ui patch: one handle at 50 by default, constrained to custom bounds. Explicit values remain untouched.
  const initialValue = defaultValue ?? [Math.min(max, Math.max(min, 50))]
  const _values = value ?? initialValue
  const count = _values.length

  // boolean-ui patch: the slider's name moves to its handles, the only parts with a role; a range's handles add their
  // own name from the provider strings, which replace Radix's English "Minimum" and "Maximum" (stock: a name on the
  // root, where nothing reads it).
  const thumbProps = (index: number) => {
    if (count === 1) {
      return {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        "aria-describedby": ariaDescribedby,
      }
    }
    const id = `${baseId}-thumb-${index}`
    const own =
      count === 2
        ? [strings.sliderMinimum, strings.sliderMaximum][index]
        : fillString(strings.sliderValue, { index: index + 1, count })
    return {
      id,
      "aria-label": ariaLabel ? `${ariaLabel} ${own}` : own,
      "aria-labelledby": ariaLabelledby ? `${ariaLabelledby} ${id}` : undefined,
      "aria-describedby": ariaDescribedby,
    }
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-size={resolved}
      defaultValue={initialValue}
      value={value}
      min={min}
      max={max}
      // boolean-ui patch: a disabled slider submits nothing, as a disabled input does; Radix's hidden inputs take no
      // `disabled` (stock: the value is submitted while disabled).
      name={props.disabled ? undefined : name}
      // boolean-ui patch: the BooleanPress look — the handle and track sizes as variables per size (20px handle with a
      // 16px knob on a 3px track; sm 16/12/2px; lg 24/20/4px); a handle-sized root; vertical at least 100px tall
      // (stock: one size, 50%, at least 176px).
      className={cn(
        "relative flex w-full touch-none items-center select-none [--slider-knob:1rem] [--slider-thumb:1.25rem] [--slider-track:3px] data-[orientation=horizontal]:h-(--slider-thumb) data-[orientation=vertical]:min-h-25 data-[orientation=vertical]:w-(--slider-thumb) data-[orientation=vertical]:flex-col data-[size=lg]:[--slider-knob:1.25rem] data-[size=lg]:[--slider-thumb:1.5rem] data-[size=lg]:[--slider-track:4px] data-[size=sm]:[--slider-knob:0.75rem] data-[size=sm]:[--slider-thumb:1rem] data-[size=sm]:[--slider-track:2px]",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        // boolean-ui patch: a 3px track (by size) in the edge colour (stock: 6px, `--muted`).
        className={cn(
          "relative grow overflow-hidden rounded-full bg-border data-[orientation=horizontal]:h-(--slider-track) data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-(--slider-track)"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          {...thumbProps(index)}
          // boolean-ui patch: the BooleanPress handle — a 20px circle (by size) in the edge colour holding a 16px knob
          // in the page colour with a hairline shadow, the grab cursor; focus is a 1px
          // `--ring` outline 2px outside; colours fade over `--bui-duration-control` (stock: a 16px white circle with a
          // primary edge and a 4px ring on hover and focus).
          className="flex size-(--slider-thumb) shrink-0 cursor-grab items-center justify-center rounded-full bg-border transition-[color,background-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none before:block before:size-(--slider-knob) before:rounded-full before:bg-background before:shadow-[0_0.5px_0_0_rgb(0_0_0/0.08),0_1px_1px_0_rgb(0_0_0/0.14)] before:transition-[background-color] before:duration-(--bui-duration-control) focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid active:cursor-grabbing data-[disabled]:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
