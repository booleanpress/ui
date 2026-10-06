"use client"

// Toolbar: built on Radix Toolbar — one tab stop, the arrow keys between its buttons, links and toggles.

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { EllipsisIcon } from "lucide-react"
import { Toolbar as ToolbarPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/button"
import { toggleVariants } from "@/components/toggle"
import { useControlSize, useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.1 */
function Toolbar({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      orientation={orientation}
      className={cn(
        "group/toolbar flex flex-wrap items-center justify-between gap-2 rounded-md border bg-card p-2.5 text-card-foreground",
        "data-[orientation=vertical]:w-fit data-[orientation=vertical]:flex-col data-[orientation=vertical]:flex-nowrap data-[orientation=vertical]:justify-start",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ToolbarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="toolbar-group"
      className={cn(
        "flex flex-wrap items-center gap-2 group-data-[orientation=vertical]/toolbar:flex-col group-data-[orientation=vertical]/toolbar:flex-nowrap",
        className
      )}
      {...props}
    />
  )
}

type ToolbarButtonProps = Omit<React.ComponentProps<typeof ToolbarPrimitive.Button>, "asChild"> &
  Omit<VariantProps<typeof buttonVariants>, "variant"> & {
    /** The button's look, as Button's. `ghost` by default: muted text that takes the faintest surface on hover. */
    variant?: VariantProps<typeof buttonVariants>["variant"]
    /**
     * Shows the spinner and sets `aria-busy` and `aria-disabled`, as Button's: the button ignores presses but keeps its
     * focus, and the arrow keys still reach it.
     */
    loading?: boolean
  }

/** @since 0.1.1 */
function ToolbarButton({
  className,
  variant = "ghost",
  size,
  severity,
  raised,
  rounded,
  loading,
  children,
  "data-slot": slot = "toolbar-button",
  ...props
}: ToolbarButtonProps & { "data-slot"?: string }) {
  // A loading button is not `disabled`, which would drop its focus to the page and let the arrow keys skip it: Button
  // marks it `aria-disabled` and refuses the press itself.
  return (
    <ToolbarPrimitive.Button asChild {...props}>
      <Button
        data-slot={slot}
        variant={variant}
        size={size}
        severity={severity}
        raised={raised}
        rounded={rounded}
        loading={loading}
        // The visual target's secondary text button: a plain ghost button in the muted text colour.
        className={cn(variant === "ghost" && !severity && "text-muted-foreground hover:text-accent-foreground", className)}
      >
        {children}
      </Button>
    </ToolbarPrimitive.Button>
  )
}

/** @since 0.1.1 */
function ToolbarOverflowButton({ children, "aria-label": ariaLabel, ...props }: ToolbarButtonProps) {
  const strings = useUiStrings()
  return (
    <ToolbarButton data-slot="toolbar-overflow-button" aria-label={ariaLabel ?? strings.moreActions} {...props}>
      {children ?? <EllipsisIcon aria-hidden="true" />}
    </ToolbarButton>
  )
}

/** @since 0.1.1 */
function ToolbarLink({ className, ...props }: React.ComponentProps<typeof ToolbarPrimitive.Link>) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      className={cn(buttonVariants({ variant: "link" }), className)}
      {...props}
    />
  )
}

const ToolbarToggleContext = React.createContext<VariantProps<typeof toggleVariants>>({ size: undefined })

/** @since 0.1.1 */
function ToolbarToggleGroup({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup> & Pick<VariantProps<typeof toggleVariants>, "size">) {
  const resolvedSize = useControlSize(size)
  return (
    <ToolbarPrimitive.ToggleGroup
      data-slot="toolbar-toggle-group"
      data-size={resolvedSize}
      className={cn("flex w-fit items-center rounded-md group-data-[orientation=vertical]/toolbar:flex-col", className)}
      {...props}
    >
      <ToolbarToggleContext.Provider value={{ size: resolvedSize }}>{children}</ToolbarToggleContext.Provider>
    </ToolbarPrimitive.ToggleGroup>
  )
}

/** @since 0.1.1 */
function ToolbarToggleItem({
  className,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem>) {
  const { size } = React.useContext(ToolbarToggleContext)
  // boolean-ui patch: share Toggle's content plate while preserving a caller's asChild element.
  const indicator = (label: React.ReactNode) => <span data-slot="toggle-indicator">{label}</span>
  const content = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
    ? React.cloneElement(children, {}, indicator(children.props.children))
    : indicator(children)
  return (
    <ToolbarPrimitive.ToggleItem
      data-slot="toolbar-toggle-item"
      data-size={size ?? undefined}
      className={cn(
        toggleVariants({ size }),
        // Joined items form one segmented pill, as ToggleGroup's: square inner corners, rounded at the ends of the row (or
        // of the column, in a vertical toolbar).
        "w-auto min-w-0 shrink-0 rounded-none focus:z-10 focus-visible:z-10",
        "group-data-[orientation=horizontal]/toolbar:first:rounded-s-md group-data-[orientation=horizontal]/toolbar:last:rounded-e-md",
        "group-data-[orientation=vertical]/toolbar:first:rounded-t-md group-data-[orientation=vertical]/toolbar:last:rounded-b-md",
        className
      )}
      {...props}
      asChild={asChild}
    >
      {content}
    </ToolbarPrimitive.ToggleItem>
  )
}

/** @since 0.1.1 */
function ToolbarSeparator({ className, ...props }: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:mx-1 data-[orientation=vertical]:h-5 data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarOverflowButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
}
