"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import { ScrollContainer } from "@/lib/scroll-focus"

/** @since 0.1.1 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    // boolean-ui patch: a table wider than its container scrolls in a box that takes keyboard focus when the table has
    // nothing focusable in it, so the arrow keys can scroll it (stock: a plain div, unreachable by keyboard).
    <ScrollContainer
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </ScrollContainer>
  )
}

/** @since 0.1.1 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      // boolean-ui patch: the header row is never tinted on hover (stock: it takes the body rows' hover fill).
      className={cn("[&_tr]:border-b [&_tr]:hover:bg-transparent [&_tr]:hover:text-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      // boolean-ui patch: the last row keeps its line, so the table ends on an edge (stock: border-0 on the last row).
      className={cn(className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      // boolean-ui patch: footer cells sit on the table's own surface in semibold, between lines, and do not tint on
      // hover (stock: bg-muted/50, font-medium, no line under the last row).
      className={cn(
        "border-t font-semibold [&>tr]:hover:bg-transparent [&>tr]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        // boolean-ui patch: the BooleanPress look — 1px row lines (subtler in dark), the content-hover fill on hover, and a
        // selected row in the solid highlight colour with its own text colour (stock: bg-muted/50 hover, bg-muted
        // selected).
        "border-b border-border text-foreground transition-colors duration-(--bui-duration-control) hover:bg-accent hover:text-accent-foreground has-aria-expanded:bg-accent dark:border-muted",
        "data-[state=selected]:border-accent data-[state=selected]:bg-highlight data-[state=selected]:text-highlight-foreground data-[state=selected]:hover:bg-highlight data-[state=selected]:hover:text-highlight-foreground dark:data-[state=selected]:border-card [&:has(+[data-state=selected])]:border-accent dark:[&:has(+[data-state=selected])]:border-card",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      // boolean-ui patch: 0.5rem by 0.875rem padding, 14px semibold on a 24px line (stock: h-10 px-2, font-medium).
      className={cn(
        "px-3.5 py-2 text-start align-middle text-sm/6 font-semibold whitespace-nowrap text-foreground [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      // boolean-ui patch: 0.5rem by 0.875rem padding (stock: p-2).
      className={cn(
        "px-3.5 py-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      // boolean-ui patch: a muted line at the start, padded like the cells (stock: mt-4, centred).
      className={cn("px-3.5 py-2 text-start text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
