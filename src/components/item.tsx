import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

import { Separator } from "@/components/separator"

/** @since 0.1.1 */
function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      // boolean-ui patch: no role="list" (stock), whose items would need role="listitem", which Item does not have.
      data-slot="item-group"
      className={cn("group/item-group flex flex-col", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  // boolean-ui patch: the BooleanPress look — a list row: 14px text on a 1.5 line, 6px radius, the content-hover fill and
  // text colour when it is a link, and the 1px focus outline 2px out (stock: an accent/50 hover, a 3px focus ring).
  "group/item flex flex-wrap items-center rounded-md border border-transparent text-sm/normal text-foreground transition-[color,background-color,border-color,outline-color] duration-(--bui-duration-control) outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring [a]:hover:bg-accent [a]:hover:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        // boolean-ui patch: the full content-hover fill; a link item goes one step darker on hover (stock: bg-muted/50).
        muted: "bg-muted [a]:hover:bg-secondary-hover",
      },
      // boolean-ui patch: 0.625rem by 0.875rem padding, and 0.25rem by 0.625rem for `sm`, like a list option (stock:
      // p-4 and px-4 py-3).
      size: {
        default: "gap-3.5 px-3.5 py-2.5",
        sm: "gap-2 px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** @since 0.1.1 */
function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        // boolean-ui patch: a 2rem tile on the secondary fill with a 6px radius and a 14px icon, no border; images take
        // the same radius (stock: rounded-sm, a border, bg-muted, a 16px icon).
        icon: "size-8 rounded-md bg-secondary text-secondary-foreground [&_svg:not([class*='size-'])]:size-3.5",
        image:
          "size-10 overflow-hidden rounded-md [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/** @since 0.1.1 */
function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      // boolean-ui patch: 0.125rem between the title and the description (stock: gap-1).
      className={cn(
        "flex flex-1 flex-col gap-0.5 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      // boolean-ui patch: 14px medium on the normal 1.5 line (stock: leading-snug).
      className={cn(
        "flex w-fit items-center gap-2 text-sm/normal font-medium",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
