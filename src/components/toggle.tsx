"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Toggle as TogglePrimitive } from "radix-ui"

import { useControlSize } from "@booleanpress/ui/provider"

/** @since 0.1.0 */
const toggleVariants = cva(
  [
    // boolean-ui patch: 4px frame around a padded content plate. Pressed content has its own fill and shadow.
    "group/toggle relative inline-flex cursor-pointer select-none items-center justify-center rounded-md border border-transparent bg-muted p-1 font-medium whitespace-nowrap text-field-placeholder transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:bg-field-disabled disabled:text-field-disabled-foreground aria-invalid:border-invalid dark:bg-background dark:disabled:bg-field-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
    "data-[state=on]:text-foreground [&>[data-slot=toggle-indicator]]:inline-flex [&>[data-slot=toggle-indicator]]:flex-auto [&>[data-slot=toggle-indicator]]:items-center [&>[data-slot=toggle-indicator]]:justify-center [&>[data-slot=toggle-indicator]]:gap-2 [&>[data-slot=toggle-indicator]]:rounded-md [&>[data-slot=toggle-indicator]]:px-2.5 [&>[data-slot=toggle-indicator]]:py-0.5 [&>[data-slot=toggle-indicator]]:transition-[background-color,box-shadow] [&>[data-slot=toggle-indicator]]:duration-(--bui-duration-control) data-[state=on]:[&>[data-slot=toggle-indicator]]:bg-background data-[state=on]:[&>[data-slot=toggle-indicator]]:shadow-(--bui-shadow-toggle) dark:data-[state=on]:[&>[data-slot=toggle-indicator]]:bg-muted",
  ],
  {
    variants: {
      variant: {
        default: "",
        // boolean-ui patch: the same pill with a visible 1px content edge (stock: a form-control edge, a shadow and the
        // accent on hover).
        outline: "border-border",
      },
      size: {
        // boolean-ui patch: the default is 34px tall, with 30px small and 38px large frames.
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** @since 0.1.0 */
function Toggle({
  className,
  variant,
  size,
  fluid = false,
  children,
  pressed,
  defaultPressed = false,
  onPressedChange,
  asChild = false,
  ...props
}: Omit<React.ComponentProps<typeof TogglePrimitive.Root>, "children"> &
  VariantProps<typeof toggleVariants> & {
    /** Fills the width of its container. @since 0.1.0 */
    fluid?: boolean
    /** Content, or a function of the current pressed state. Keep an accessible name stable across states. */
    children?: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode)
  }) {
  // boolean-ui patch: the size falls back to the provider's `controlSize` and is set as `data-size` (stock: the variant
  // default only).
  const resolvedSize = useControlSize(size)
  // boolean-ui patch: render content from the same controlled or uncontrolled state passed to Radix.
  const [internalPressed, setInternalPressed] = React.useState(defaultPressed)
  const isPressed = pressed ?? internalPressed
  const content = typeof children === "function" ? children({ pressed: isPressed }) : children
  const indicator = (label: React.ReactNode) => <span data-slot="toggle-indicator">{label}</span>
  const child = asChild && React.isValidElement<{ children?: React.ReactNode }>(content)
    ? React.cloneElement(content, {}, indicator(content.props.children))
    : indicator(content)

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-size={resolvedSize}
      // boolean-ui patch: `fluid` fills the container (stock: no prop).
      className={cn(toggleVariants({ variant, size: resolvedSize }), fluid && "w-full", className)}
      {...props}
      asChild={asChild}
      pressed={isPressed}
      onPressedChange={(next) => {
        if (pressed === undefined) setInternalPressed(next)
        onPressedChange?.(next)
      }}
    >
      {child}
    </TogglePrimitive.Root>
  )
}

export { Toggle, toggleVariants }
