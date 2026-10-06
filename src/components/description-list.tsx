"use client"

// DescriptionList: built on semantic HTML — a description list (`dl`), each item a `div` holding a term and its value.
import * as React from "react"
import { cn } from "@/lib/utils"

import { useControlSize, type ControlSize } from "@booleanpress/ui/provider"

/** Where an item's label goes: beside its value, or above it. @since 0.1.0 */
type DescriptionListOrientation = "horizontal" | "vertical"

const DescriptionListContext = React.createContext<{
  orientation: DescriptionListOrientation
  bordered: boolean
  columns: number
}>({
  orientation: "vertical",
  bordered: false,
  columns: 1,
})

/**
 * Pairs of labels and values, such as a record's settings: a description list in one to three columns, the label above
 * its value or beside it, optionally drawn as a bordered table.
 *
 * @since 0.1.0
 */
function DescriptionList({
  className,
  style,
  orientation = "vertical",
  columns = 1,
  bordered = false,
  size,
  ...props
}: React.ComponentProps<"dl"> & {
  /** `vertical` puts each label above its value; `horizontal` puts it beside, the labels in a column of their own. */
  orientation?: DescriptionListOrientation
  /** How many items share a row, from the `sm` breakpoint (640 px); one per row below it. */
  columns?: 1 | 2 | 3
  /** Draws the list as a table: an edge round it and between the items, the labels on the subtle fill. */
  bordered?: boolean
  /** The text size, 12, 14 or 16 px, and the spacing with it. Defaults to the provider's `controlSize`. */
  size?: ControlSize
}) {
  const resolvedSize = useControlSize(size)
  const context = React.useMemo(() => ({ orientation, bordered, columns }), [orientation, bordered, columns])

  return (
    <DescriptionListContext.Provider value={context}>
      <dl
        data-slot="description-list"
        data-orientation={orientation}
        data-size={resolvedSize}
        data-bordered={bordered || undefined}
        style={{ "--description-columns": columns, ...style } as React.CSSProperties}
        className={cn(
          "group/description-list m-0 grid text-sm/normal data-[size=lg]:text-base/normal data-[size=sm]:text-xs/normal",
          // One item per row below 640 px; from there `columns` of them. Beside their values, the labels take a column
          // as wide as the widest label, shared by every item through a subgrid, but no wider than 40% of the list
          // (shared between the columns) unless one word needs more: a long label wraps rather than squeeze the values.
          orientation === "horizontal"
            ? "grid-cols-[fit-content(40%)_minmax(0,1fr)] sm:grid-cols-[repeat(var(--description-columns),fit-content(calc(40%/var(--description-columns)))_minmax(0,1fr))]"
            : "grid-cols-1 sm:grid-cols-[repeat(var(--description-columns),minmax(0,1fr))]",
          bordered
            ? // A 1px content edge round the list with a 6px radius, and 1px gaps between the items, where they draw
              // the lines between them (see DescriptionItem).
              "gap-px overflow-hidden rounded-md border"
            : "gap-x-8 gap-y-3.5 data-[size=lg]:gap-x-10 data-[size=lg]:gap-y-4.5 data-[size=sm]:gap-x-6 data-[size=sm]:gap-y-2.5",
          className
        )}
        {...props}
      />
    </DescriptionListContext.Provider>
  )
}

/**
 * One label and its value: a `dt` and a `dd`, wrapped in a `div`. `children` is the value; `action` sits at its end, such
 * as a copy button.
 *
 * @since 0.1.0
 */
function DescriptionItem({
  className,
  style,
  label,
  action,
  span,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The label, shown in the muted colour. */
  label: React.ReactNode
  /** The value. */
  children?: React.ReactNode
  /** A control at the end of the value, such as a copy button. Name it after the item ("Copy host"). */
  action?: React.ReactNode
  /** How many columns the item spans, from the `sm` breakpoint, for a long value such as an address; at most `columns`. */
  span?: number
}) {
  const { orientation, bordered, columns } = React.useContext(DescriptionListContext)
  const horizontal = orientation === "horizontal"
  // Never more columns than the list has: a wider span would add columns of its own and push the others out of line.
  const spanned = span ? Math.min(span, columns) : 1
  const tracks = spanned > 1 ? (horizontal ? spanned * 2 : spanned) : undefined

  return (
    <div
      data-slot="description-item"
      style={tracks ? ({ "--description-span": `span ${tracks}`, ...style } as React.CSSProperties) : style}
      className={cn(
        "min-w-0",
        tracks && "sm:[grid-column:var(--description-span)]",
        horizontal ? "col-span-2 grid grid-cols-subgrid items-baseline" : "flex flex-col gap-1",
        // Beside its value, the label keeps 1rem from it (0.75 and 1.25rem at sm and lg).
        horizontal &&
          !bordered &&
          "gap-x-4 group-data-[size=lg]/description-list:gap-x-5 group-data-[size=sm]/description-list:gap-x-3",
        // Bordered: each item draws a 1px line round itself, outside its box, in the 1px gap to its neighbours, where
        // their lines fall on one another; the list clips the lines along its own edge, and an empty cell at the end of
        // the last row stays blank, edged by its neighbours' lines.
        bordered && "gap-0 shadow-[0_0_0_1px_var(--border)]",
        bordered && horizontal && "items-stretch",
        className
      )}
      {...props}
    >
      <dt
        data-slot="description-label"
        className={cn(
          "m-0 min-w-0 text-muted-foreground",
          bordered &&
            "bg-subtle px-3.5 py-2.5 group-data-[size=lg]/description-list:px-4.5 group-data-[size=lg]/description-list:py-3.5 group-data-[size=sm]/description-list:px-2.5 group-data-[size=sm]/description-list:py-1.5",
          bordered && (horizontal ? "border-e" : "border-b")
        )}
      >
        {label}
      </dt>
      <dd
        data-slot="description-value"
        className={cn(
          "m-0 min-w-0 break-words text-foreground",
          action && "flex items-center justify-between gap-2",
          bordered &&
            "px-3.5 py-2.5 group-data-[size=lg]/description-list:px-4.5 group-data-[size=lg]/description-list:py-3.5 group-data-[size=sm]/description-list:px-2.5 group-data-[size=sm]/description-list:py-1.5",
          bordered && action && "py-1.5 group-data-[size=lg]/description-list:py-2.5 group-data-[size=sm]/description-list:py-1"
        )}
      >
        {action ? (
          <>
            <span data-slot="description-value-text" className="min-w-0 break-words">
              {children}
            </span>
            <span data-slot="description-action" className="flex shrink-0 items-center gap-1">
              {action}
            </span>
          </>
        ) : (
          children
        )}
      </dd>
    </div>
  )
}

export { DescriptionList, DescriptionItem }
export type { DescriptionListOrientation }
