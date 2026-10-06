"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { toggleVariants } from "@/components/toggle"
import { useControlSize } from "@booleanpress/ui/provider"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    fluid?: boolean
    selected?: string[]
  }
>({
  // boolean-ui patch: no default size, so an item resolves its own `size`, then the provider's `controlSize` (stock:
  // "default").
  size: undefined,
  variant: "default",
  spacing: 0,
  fluid: false,
})

/** @since 0.1.0 */
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  fluid = false,
  children,
  allowEmpty = true,
  rovingFocus = false,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    /** Whether the last pressed item can be released. Defaults to true. @since 0.1.0 */
    allowEmpty?: boolean
    /** Fills the width of its container; the items share it equally. @since 0.1.0 */
    fluid?: boolean
  }) {
  const resolvedSize = useControlSize(size)
  // boolean-ui patch: keep a required selection while retaining Radix's selection engine.
  const [internalValue, setInternalValue] = React.useState<string | string[]>(props.defaultValue ?? (props.type === "single" ? "" : []))
  const value = props.value ?? internalValue
  const selected = typeof value === "string" ? value ? [value] : [] : value
  const change = (next: string | string[]) => {
    if (!allowEmpty && next.length === 0) return
    if (props.value === undefined) setInternalValue(next)
    if (props.type === "single" && typeof next === "string") props.onValueChange?.(next)
    if (props.type === "multiple" && Array.isArray(next)) props.onValueChange?.(next)
  }
  const selection = props.type === "single"
    ? { type: "single" as const, value: value as string, onValueChange: change }
    : { type: "multiple" as const, value: value as string[], onValueChange: change }

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={resolvedSize}
      data-spacing={spacing}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        // boolean-ui patch: no shadow under an outlined group (stock: shadow-xs).
        "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md",
        // boolean-ui patch: `fluid` fills the container (stock: no prop).
        fluid && "w-full",
        // boolean-ui patch: a joined group with `aria-invalid` draws one `--invalid` edge round the whole bar, above the
        // items (stock: no group invalid state).
        spacing === 0 &&
          "aria-invalid:relative aria-invalid:after:pointer-events-none aria-invalid:after:absolute aria-invalid:after:inset-0 aria-invalid:after:z-20 aria-invalid:after:rounded-md aria-invalid:after:border aria-invalid:after:border-invalid",
        className
      )}
      {...props}
      {...selection}
      defaultValue={undefined}
      // boolean-ui patch: ordinary toggle buttons in the Tab order by default; roving focus remains opt-in.
      role="group"
      rovingFocus={rovingFocus}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing, fluid, selected }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

/** @since 0.1.0 */
function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  // boolean-ui patch: the group's size, else the item's, else the provider's `controlSize` (stock: no provider).
  const resolvedSize = useControlSize(context.size || size)
  const indicator = (label: React.ReactNode) => <span data-slot="toggle-indicator">{label}</span>
  const content = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
    ? React.cloneElement(children, {}, indicator(children.props.children))
    : indicator(children)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={resolvedSize}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: resolvedSize,
        }),
        "w-auto min-w-0 shrink-0 focus:z-10 focus-visible:z-10",
        // boolean-ui patch: joined items form one segmented pill: square inner corners, one edge between neighbours for
        // both variants, the item's own padding kept (stock: 12px padding, the shared edge for the outline variant only).
        "data-[spacing=0]:rounded-none data-[spacing=0]:border-s-0 data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-s-md data-[spacing=0]:first:border-s data-[spacing=0]:last:rounded-e-md",
        // boolean-ui patch: in a spaced group with `aria-invalid`, each item takes the `--invalid` edge (stock: no group
        // invalid state).
        "group-aria-invalid/toggle-group:not-data-[spacing=0]:border-invalid",
        // boolean-ui patch: in a fluid group the items share the width equally; when the group is narrower than its
        // labels, a label of several words wraps, centred, and a single word too long for its item is clipped at the
        // item's end, so no text runs over the next item (stock: no prop).
        context.fluid && "flex-1 justify-center-safe overflow-hidden text-center whitespace-normal wrap-break-word",
        className
      )}
      {...props}
      asChild={asChild}
      role="button"
      aria-checked={undefined}
      aria-pressed={context.selected?.includes(props.value) ?? false}
    >
      {content}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
