import { cn } from "@/lib/utils"

/** @since 0.1.0 */
function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // boolean-ui patch: the BooleanPress placeholder — a light slate block (a faint white tint in dark), 6px radius,
        // with a soft highlight sweeping across it every 1.2s from the inline start, drawn by a pseudo-element; the
        // sweep stops under reduced motion (stock: the accent fill, pulsing).
        "relative overflow-hidden rounded-md bg-border dark:bg-foreground/6",
        "after:absolute after:inset-0 after:translate-x-full after:animate-in after:bg-linear-to-r after:from-transparent after:via-background/40 after:to-transparent after:repeat-infinite after:slide-in-from-left-[200%] after:animation-duration-[1.2s] rtl:after:-translate-x-full rtl:after:slide-in-from-right-[200%] dark:after:via-foreground/4",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
