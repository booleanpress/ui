"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, fillString } from "@/lib/utils"
import { Slot } from "radix-ui"

import { useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.0 */
const badgeVariants = cva(
  // boolean-ui patch: the BooleanPress tag — 12px bold text on an 18px line, 2px 6px padding (the 1px edge counted)
  // making 22px, 6px radius, 4px gap, 14px icons, a 1px outline 2px away on keyboard focus, never wider than its
  // container (stock: a pill, medium weight, 12px icons, a 3px ring, no width limit).
  "inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-1.25 py-px text-xs/normal font-bold whitespace-nowrap transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid aria-invalid:border-invalid [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        // boolean-ui patch: slate fill, dark slate text; light slate text in dark (stock: the primary fill).
        default:
          "bg-secondary text-foreground dark:text-secondary-foreground [a&]:hover:bg-secondary-hover",
        // boolean-ui patch: slate fill with the secondary text, one step darker on hover (stock: 90% opacity).
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary-hover [a&]:hover:text-secondary-hover-foreground",
        // boolean-ui patch: the status tags — a pale fill with deep text of the same hue (stock: solid fills).
        destructive:
          "bg-destructive-tag text-destructive-tag-foreground [a&]:hover:bg-destructive-tag/80",
        // boolean-ui patch: transparent with the content edge (stock: the same, with a pill shape).
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // boolean-ui patch: the status variants (success, warning, info) on the status tag tokens.
        success:
          "bg-success-tag text-success-tag-foreground [a&]:hover:bg-success-tag/80",
        warning:
          "bg-warning-tag text-warning-tag-foreground [a&]:hover:bg-warning-tag/80",
        info: "bg-info-tag text-info-tag-foreground [a&]:hover:bg-info-tag/80",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // boolean-ui patch: underlined on hover at the font's own offset (stock: a 4px offset).
        link: "text-primary [a&]:hover:underline",
      },
      // boolean-ui patch: the visual target's solid badge colours, set with `severity`; they replace the variant's
      // colours (stock: none).
      severity: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-success text-success-foreground",
        info: "bg-info-solid text-info-solid-foreground",
        warning: "bg-warning-solid text-warning-solid-foreground",
        help: "bg-help text-help-foreground",
        danger: "bg-destructive text-destructive-foreground",
        contrast: "bg-contrast text-contrast-foreground",
      },
      // boolean-ui patch: what the badge draws, from its props: the pale `tag`; a `solid` label (with a severity),
      // 20px tall with 10px text; a `count`, round 20px with a 20px minimum width; a `dot`, 8px and empty (stock: the
      // tag only).
      kind: {
        tag: "",
        solid: "h-5 min-w-5 border-0 px-1.5 py-0 text-[0.625rem]/[0.9375rem]",
        count:
          "h-5 min-w-5 rounded-full border-0 px-1 py-0 text-[0.625rem]/[0.9375rem] in-data-[slot=button]:h-4 in-data-[slot=button]:min-w-4 in-data-[slot=button]:text-[0.625rem]/4",
        dot: "size-2 min-w-2 rounded-full border-0 p-0",
      },
      // boolean-ui patch: three sizes — sm 18px, default 22px, lg 26px for a tag; 18, 20 and 24px for a solid label and
      // a count; a dot stays 8px (stock: one size).
      size: {
        sm: "",
        default: "",
        lg: "",
      },
      // boolean-ui patch: `rounded` makes a pill (stock: none).
      rounded: {
        true: "rounded-full",
        false: "",
      },
    },
    compoundVariants: [
      { kind: "tag", size: "sm", className: "px-1 text-[0.625rem]/[0.875rem] [&>svg]:size-3" },
      { kind: "tag", size: "lg", className: "px-1.5 py-0.5 text-sm/5" },
      { kind: ["solid", "count"], size: "sm", className: "h-4.5 min-w-4.5 text-[0.5rem]/[0.75rem]" },
      { kind: ["solid", "count"], size: "lg", className: "h-6 min-w-6 text-xs/normal" },
    ],
    defaultVariants: {
      variant: "default",
      kind: "tag",
      size: "default",
    },
  }
)

/** The badge's own props, shared by every kind. */
type BadgeOwnProps = Omit<VariantProps<typeof badgeVariants>, "kind"> & {
    asChild?: boolean
    /** A number to show, in the provider's locale: the badge becomes a round count. @since 0.1.0 */
    count?: number
    /** The largest count shown; above it the badge reads `{max}+` (the provider's `badgeOverflow`). @since 0.1.0 */
    max?: number
  }

/**
 * A dot draws no text, so it needs a name (`aria-label` or `aria-labelledby`), or `aria-hidden` when the words beside
 * it say the same.
 */
type BadgeDotProps =
  | { dot: true; "aria-label": string; "aria-labelledby"?: string; "aria-hidden"?: never }
  | { dot: true; "aria-labelledby": string; "aria-label"?: string; "aria-hidden"?: never }
  | { dot: true; "aria-hidden": true | "true"; "aria-label"?: never; "aria-labelledby"?: never }

type BadgeTextProps = {
  dot?: false
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-hidden"?: React.AriaAttributes["aria-hidden"]
}

/** @since 0.1.0 */
function Badge({
  className,
  variant = "default",
  severity,
  size = "default",
  rounded = false,
  count,
  max,
  dot = false,
  asChild = false,
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "aria-label" | "aria-labelledby" | "aria-hidden"> &
  BadgeOwnProps &
  (BadgeTextProps | BadgeDotProps)) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const Comp = asChild ? Slot.Root : "span"
  const kind = dot ? "dot" : count !== undefined ? "count" : severity ? "solid" : "tag"
  // A count, a dot or a solid label without a severity takes the primary fill, as the visual target's badge does.
  const tone = severity ?? (kind === "tag" ? undefined : "primary")

  let content = children
  if (kind === "dot") content = null
  else if (count !== undefined) {
    const format = new Intl.NumberFormat(locale)
    content =
      max !== undefined && count > max ? fillString(strings.badgeOverflow, { max: format.format(max) }) : format.format(count)
  }

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      // boolean-ui patch: the severity, size, kind and pill flag as attributes, for styles and tests (stock: none).
      data-severity={severity ?? undefined}
      data-size={size}
      data-kind={kind}
      data-count={kind === "count" ? count : undefined}
      data-rounded={rounded || undefined}
      // A dot with a name is an image to assistive technology; a span cannot carry a name.
      role={kind === "dot" && (props["aria-label"] || props["aria-labelledby"]) ? "img" : undefined}
      className={cn(badgeVariants({ variant: tone ? null : variant, severity: tone, kind, size, rounded }), className)}
      {...props}
    >
      {content}
    </Comp>
  )
}

/** The props of `Badge`. @since 0.1.0 */
type BadgeProps = React.ComponentProps<typeof Badge>

export { Badge, badgeVariants }
export type { BadgeProps }
