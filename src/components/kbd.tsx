import { cn } from "@/lib/utils"

/** @since 0.1.0 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // boolean-ui patch: the BooleanPress key chip — slate fill and text with the content edge, 4px radius, 12px
        // medium text on an 18px line, 20px tall (stock: a borderless muted chip with muted text).
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm border border-border bg-secondary px-1 font-sans text-xs/normal font-medium text-secondary-foreground select-none",
        // boolean-ui patch: a label's own first letter sets its direction, so "⌘K" keeps its order on a right-to-left
        // page (the page's direction would show "K⌘") while a right-to-left key name still reads right to left. Not
        // `dir`, which would turn the logical margins set on the key itself (`ms-auto`) round.
        "[unicode-bidi:plaintext]",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:border-transparent [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      // boolean-ui patch: the keys keep their written order on a right-to-left page (Ctrl + K, not K + Ctrl), as a
      // single key's label does.
      className={cn("inline-flex items-center gap-1 rtl:flex-row-reverse", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
