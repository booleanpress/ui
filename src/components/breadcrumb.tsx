"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { Slot } from "radix-ui"

import { useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.1 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  const strings = useUiStrings()

  // boolean-ui patch: the landmark's name comes from the provider (stock: "breadcrumb").
  return <nav aria-label={strings.breadcrumb} data-slot="breadcrumb" {...props} />
}

/** @since 0.1.1 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      // boolean-ui patch: a 0.5rem gap at every width (stock: gap-1.5, gap-2.5 from sm).
      className={cn(
        "flex flex-wrap items-center gap-2 text-sm break-words text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      // boolean-ui patch: 0.5rem between an icon and its label (stock: gap-1.5).
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      // boolean-ui patch: muted 14px links with 14px icons in the lighter icon colour, the text colour on hover and the
      // 1px focus outline on a 6px radius (stock: colour change only, no focus style of its own).
      className={cn(
        "inline-flex items-center gap-2 rounded-md transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-3.5 [&_svg]:text-control-hover [&_svg]:transition-colors hover:[&_svg]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      // boolean-ui patch: the separator in the lighter icon colour (stock: the list's muted colour).
      className={cn("flex items-center text-control-hover [&>svg]:size-3.5", className)}
      {...props}
    >
      {/* boolean-ui patch: the chevron points along the reading direction (stock: always right). */}
      {children ?? <ChevronRight className="rtl:rotate-180" />}
    </li>
  )
}

/** @since 0.1.1 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const strings = useUiStrings()

  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      // boolean-ui patch: 14px dots in the lighter icon colour, as tall as a line of text (stock: a 2.25rem box, 16px).
      className={cn("flex h-5 items-center justify-center text-control-hover", className)}
      {...props}
    >
      <MoreHorizontal className="size-3.5" />
      {/* boolean-ui patch: the label comes from the provider. */}
      <span className="sr-only">{strings.more}</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
