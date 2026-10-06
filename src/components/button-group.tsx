import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

import { Separator } from "@/components/separator"

/** @since 0.1.0 */
const buttonGroupVariants = cva(
  [
    "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
    // boolean-ui patch: raised buttons lift the whole group on one shadow instead of each its own, and rounded buttons
    // make the group a pill, so the joined row keeps one outline (stock: no raised or rounded buttons).
    "rounded-md has-[>[data-raised=true]]:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),0_2px_2px_0_rgba(0,0,0,0.14),0_1px_5px_0_rgba(0,0,0,0.12)] has-[>[data-rounded=true]]:rounded-full [&>[data-raised=true]]:shadow-none",
  ],
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-s-none [&>*:not(:first-child)]:border-s-0 [&>*:not(:last-child)]:rounded-e-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

/** @since 0.1.0 */
function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      // boolean-ui patch: a `data-slot`, as every other part has, for styles and tests (stock: none).
      data-slot="button-group-text"
      className={cn(
        // boolean-ui patch: the BooleanPress look — a field-coloured addon with the form-control edge, 8px padding,
        // 36px minimum width, regular muted text and 14px icons (stock: muted fill, 16px padding, medium text, a shadow).
        "flex min-w-9 items-center justify-center gap-2 rounded-md border border-control bg-field px-2 text-sm/normal font-normal text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      // boolean-ui patch: the content edge colour, as between the joined buttons of an outlined group (stock: the
      // form-control edge, darker).
      className={cn(
        "relative m-0! self-stretch bg-border data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
