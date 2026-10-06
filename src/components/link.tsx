"use client"

// Link: no primitive. An `<a>`, or the element passed with `asChild` (a router's link), styled as a text link.

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpRightIcon } from "lucide-react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

import { useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.0 */
const linkVariants = cva(
  // Medium text that wraps with the line, its colour fading over 200ms; a 1px outline 2px away on keyboard focus, 2px
  // rounded; an icon is 0.875em, centred on the text; a disabled link is 60% opaque and ignores the pointer.
  "rounded-xs font-medium transition-[color,text-decoration-color,outline-color] duration-(--bui-duration-control) outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:inline-block [&_svg]:shrink-0 [&_svg]:align-[-0.125em] [&_svg:not([class*='size-'])]:size-[0.875em]",
  {
    variants: {
      variant: {
        // The primary colour, as the visual target's link button.
        default: "text-primary decoration-primary/40 hover:decoration-primary",
        // Slate text that turns to the body colour on hover.
        muted: "text-muted-foreground decoration-muted-foreground/40 hover:text-foreground hover:decoration-foreground",
        // The danger text colour, for a link that removes or leaves something.
        destructive: "text-destructive-strong decoration-destructive-strong/40 hover:decoration-destructive-strong",
      },
      underline: {
        // Underlined on hover only, in the full text colour: a link that stands apart from text (a list, a footer).
        hover: "no-underline hover:underline",
        // Always underlined, a little below the text: a link inside running text, which colour alone cannot mark.
        always: "underline underline-offset-[0.2em]",
      },
      size: {
        // 12px on an 18px line, 14px on 21px, 16px on 24px; without a size it takes the size of the text around it.
        sm: "text-xs/normal",
        default: "text-sm/normal",
        lg: "text-base/normal",
      },
      visited: {
        // A purple text colour once the address has been visited.
        true: "visited:text-help-active",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      underline: "hover",
      visited: false,
    },
  }
)

/** @since 0.1.0 */
function Link({
  className,
  variant = "default",
  underline = "hover",
  size,
  visited = false,
  external = false,
  disabled = false,
  asChild = false,
  href,
  target,
  rel,
  tabIndex,
  onClick,
  children,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    /** Render the child element instead (a router's link), with this link's look and behaviour merged onto it. */
    asChild?: boolean
    /**
     * Opens in a new tab: adds `target="_blank"`, `rel="noopener noreferrer"`, an arrow after the text and a visually
     * hidden "(opens in a new tab)" from the provider's `opensInNewTab` string.
     */
    external?: boolean
    /**
     * Turns the link off: it sets `aria-disabled`, loses its address (with `asChild`, its place in the tab order) and
     * ignores the pointer.
     */
    disabled?: boolean
  }) {
  const strings = useUiStrings()
  const Comp = asChild ? Slot.Root : "a"
  // With `asChild` the child's own `rel` would win over the merged one, so it is read and merged too.
  const child = asChild && React.isValidElement<{ rel?: string }>(children) ? children : null
  const childRel = child?.props.rel
  // rel keeps the consumer's own values and adds the two that stop the new tab reaching back to this page.
  const relValue = external
    ? Array.from(
        new Set([...`${rel ?? ""} ${childRel ?? ""}`.split(/\s+/).filter(Boolean), "noopener", "noreferrer"])
      ).join(" ")
    : rel

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <Comp
      data-slot="link"
      data-variant={variant}
      data-size={size ?? undefined}
      data-external={external || undefined}
      // A disabled `<a>` has no address, so it cannot be followed or reached with Tab, and `role="link"` keeps it
      // announced as a link. With `asChild` the child keeps its own address, so it leaves the tab order instead.
      role={disabled && !asChild ? "link" : undefined}
      aria-disabled={disabled || undefined}
      href={disabled && !asChild ? undefined : href}
      tabIndex={disabled ? (asChild ? -1 : undefined) : tabIndex}
      target={external ? (target ?? "_blank") : target}
      rel={relValue}
      onClick={handleClick}
      className={cn(linkVariants({ variant, underline, size, visited }), className)}
      {...props}
    >
      {asChild ? (
        <Slot.Slottable>{child && external && childRel ? React.cloneElement(child, { rel: relValue }) : children}</Slot.Slottable>
      ) : (
        children
      )}
      {external ? (
        <>
          {/* A word joiner, unbreakable with the arrow, keeps the arrow on the line of the last word; the arrow is
              mirrored on a right-to-left page, so it points up and away from the text. */}
          <span aria-hidden="true" className="whitespace-nowrap">
            {"\u2060"}
            <ArrowUpRightIcon data-slot="link-external-icon" aria-hidden="true" className="ms-0.5 rtl:-scale-x-100" />
          </span>
          <span data-slot="link-external-label" className="sr-only">
            {` ${strings.opensInNewTab}`}
          </span>
        </>
      ) : null}
    </Comp>
  )
}

export { Link, linkVariants }
