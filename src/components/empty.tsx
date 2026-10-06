import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** @since 0.1.1 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      // boolean-ui patch: the card radius, 12px, and a dashed --border edge when a border is added (stock: rounded-lg).
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-xl border-dashed border-border p-6 text-center text-balance md:p-12",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        // boolean-ui patch: a 2.5rem box on the secondary fill with a 6px radius and a 20px icon in the secondary text
        // colour (stock: rounded-lg, bg-muted, text-foreground, a 24px icon).
        icon: "flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/** @since 0.1.1 */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      // boolean-ui patch: 18px, medium weight, in the text colour at the normal tracking, like a card title (stock:
      // tracking-tight, the inherited colour).
      className={cn("text-lg/normal font-medium text-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      // boolean-ui patch: 14px on the normal 1.5 line height (stock: text-sm/relaxed).
      className={cn(
        "text-sm/normal text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
