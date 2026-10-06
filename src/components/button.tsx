import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

import { Spinner } from "@/components/spinner"

/** @since 0.1.1 */
const buttonVariants = cva(
  // boolean-ui patch: the BooleanPress look — 14px/21px medium text, 6px 10px padding and a 1px edge make 35px, 6px
  // radius, 8px gap, 14px icons, colour fades over 200ms, a 1px outline 2px away on keyboard focus, 60% opacity when
  // disabled or loading (stock: 36px fixed height, 16px icons, a 3px ring, 50% opacity).
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent font-medium whitespace-nowrap transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:opacity-60 data-disabled:pointer-events-none data-disabled:opacity-60 data-loading:pointer-events-none data-loading:opacity-60 aria-invalid:border-invalid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        // boolean-ui patch: near-black fill that steps lighter on hover and press (stock: 90% opacity on hover).
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        // boolean-ui patch: the danger fill with its own hover and press steps and a red focus outline (stock: white
        // text on a 60% fill in dark).
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active focus-visible:outline-destructive",
        // boolean-ui patch: transparent with a light edge and near-black text; the faintest surface on hover (stock:
        // page fill, a shadow and the accent on hover).
        outline:
          "border-border bg-transparent text-primary hover:bg-subtle active:bg-accent dark:hover:bg-primary/4 dark:active:bg-primary/16",
        // boolean-ui patch: slate fill and text, one step darker on hover and press, a slate focus outline (stock:
        // 80% opacity on hover).
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover hover:text-secondary-hover-foreground focus-visible:outline-secondary-foreground active:bg-secondary-active active:text-accent-foreground",
        // boolean-ui patch: a text button — near-black text, the faintest surface on hover (stock: the accent).
        ghost:
          "bg-transparent text-primary hover:bg-subtle active:bg-accent dark:hover:bg-primary/4 dark:active:bg-primary/16",
        // boolean-ui patch: near-black text underlined on hover at the font's own offset (stock: primary text, a 4px
        // underline offset).
        link: "bg-transparent text-primary hover:underline",
      },
      size: {
        // boolean-ui patch: heights come from padding and line height: 35px default, 24px xs, 28px sm, 42px lg; icon
        // buttons 36, 24, 28 and 42px square (stock: fixed heights 36, 24, 32 and 40px).
        default: "px-2.5 py-1.5 text-sm/normal",
        xs: "gap-1 px-1.5 py-0.5 text-xs/normal [&_svg:not([class*='size-'])]:size-3",
        sm: "px-2 py-1 text-xs/normal",
        lg: "px-3 py-2 text-base/normal",
        icon: "size-9 text-sm/normal",
        "icon-xs": "size-6 text-xs/normal [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 text-xs/normal",
        "icon-lg": "size-[2.625rem] text-base/normal",
      },
      // boolean-ui patch: the visual target's severities, set with `severity`. Each colours the `default` (solid),
      // `outline`, `ghost` and `link` variants through the compound variants below; `secondary` and `destructive` keep
      // their own colours (stock: none).
      severity: {
        success: "",
        info: "",
        warning: "",
        help: "",
        danger: "",
        contrast: "",
      },
      // boolean-ui patch: `raised` lifts the button on the visual target's three-layer shadow (stock: none).
      raised: {
        true: "shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),0_2px_2px_0_rgba(0,0,0,0.14),0_1px_5px_0_rgba(0,0,0,0.12)]",
        false: "",
      },
      // boolean-ui patch: `rounded` makes a pill, and a circle of a square icon button (stock: none).
      rounded: {
        true: "rounded-full",
        false: "",
      },
      // boolean-ui patch: `fluid` fills the container's width, as it does on every field (stock: no variant).
      fluid: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // boolean-ui patch: solid severities — a fill with its own hover and press steps, its text colour, and a focus
      // outline of the fill's colour (stock: none).
      { variant: "default", severity: "success", className: "bg-success text-success-foreground hover:bg-success-hover active:bg-success-active focus-visible:outline-success" },
      { variant: "default", severity: "info", className: "bg-info-solid text-info-solid-foreground hover:bg-info-solid-hover active:bg-info-solid-active focus-visible:outline-info-solid" },
      { variant: "default", severity: "warning", className: "bg-warning-solid text-warning-solid-foreground hover:bg-warning-solid-hover active:bg-warning-solid-active focus-visible:outline-warning-solid" },
      { variant: "default", severity: "help", className: "bg-help text-help-foreground hover:bg-help-hover active:bg-help-active focus-visible:outline-help" },
      { variant: "default", severity: "danger", className: "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active focus-visible:outline-destructive" },
      { variant: "default", severity: "contrast", className: "bg-contrast text-contrast-foreground hover:bg-contrast-hover active:bg-contrast-active focus-visible:outline-contrast" },
      // boolean-ui patch: outlined severities — the severity's pale edge, its fill colour as the text, and its faint
      // hover and press backgrounds (the `dark:` classes replace the plain outline's dark-theme ones) (stock: none).
      { variant: "outline", severity: "success", className: "border-success-edge text-success hover:bg-success-ghost-hover active:bg-success-ghost-active dark:hover:bg-success-ghost-hover dark:active:bg-success-ghost-active focus-visible:outline-success" },
      { variant: "outline", severity: "info", className: "border-info-solid-edge text-info-solid hover:bg-info-solid-ghost-hover active:bg-info-solid-ghost-active dark:hover:bg-info-solid-ghost-hover dark:active:bg-info-solid-ghost-active focus-visible:outline-info-solid" },
      { variant: "outline", severity: "warning", className: "border-warning-solid-edge text-warning-solid hover:bg-warning-solid-ghost-hover active:bg-warning-solid-ghost-active dark:hover:bg-warning-solid-ghost-hover dark:active:bg-warning-solid-ghost-active focus-visible:outline-warning-solid" },
      { variant: "outline", severity: "help", className: "border-help-edge text-help hover:bg-help-ghost-hover active:bg-help-ghost-active dark:hover:bg-help-ghost-hover dark:active:bg-help-ghost-active focus-visible:outline-help" },
      { variant: "outline", severity: "danger", className: "border-destructive-edge text-destructive hover:bg-destructive-ghost-hover active:bg-destructive-ghost-active dark:hover:bg-destructive-ghost-hover dark:active:bg-destructive-ghost-active focus-visible:outline-destructive" },
      { variant: "outline", severity: "contrast", className: "border-contrast-edge text-contrast hover:bg-contrast-ghost-hover active:bg-contrast-ghost-active dark:hover:bg-contrast-ghost-hover dark:active:bg-contrast-ghost-active focus-visible:outline-contrast" },
      // boolean-ui patch: text severities — the fill colour as the text on the same faint hover and press backgrounds
      // (stock: none).
      { variant: "ghost", severity: "success", className: "text-success hover:bg-success-ghost-hover active:bg-success-ghost-active dark:hover:bg-success-ghost-hover dark:active:bg-success-ghost-active focus-visible:outline-success" },
      { variant: "ghost", severity: "info", className: "text-info-solid hover:bg-info-solid-ghost-hover active:bg-info-solid-ghost-active dark:hover:bg-info-solid-ghost-hover dark:active:bg-info-solid-ghost-active focus-visible:outline-info-solid" },
      { variant: "ghost", severity: "warning", className: "text-warning-solid hover:bg-warning-solid-ghost-hover active:bg-warning-solid-ghost-active dark:hover:bg-warning-solid-ghost-hover dark:active:bg-warning-solid-ghost-active focus-visible:outline-warning-solid" },
      { variant: "ghost", severity: "help", className: "text-help hover:bg-help-ghost-hover active:bg-help-ghost-active dark:hover:bg-help-ghost-hover dark:active:bg-help-ghost-active focus-visible:outline-help" },
      { variant: "ghost", severity: "danger", className: "text-destructive hover:bg-destructive-ghost-hover active:bg-destructive-ghost-active dark:hover:bg-destructive-ghost-hover dark:active:bg-destructive-ghost-active focus-visible:outline-destructive" },
      { variant: "ghost", severity: "contrast", className: "text-contrast hover:bg-contrast-ghost-hover active:bg-contrast-ghost-active dark:hover:bg-contrast-ghost-hover dark:active:bg-contrast-ghost-active focus-visible:outline-contrast" },
      // boolean-ui patch: link severities — the fill colour as the text, underlined on hover (stock: none).
      { variant: "link", severity: "success", className: "text-success focus-visible:outline-success" },
      { variant: "link", severity: "info", className: "text-info-solid focus-visible:outline-info-solid" },
      { variant: "link", severity: "warning", className: "text-warning-solid focus-visible:outline-warning-solid" },
      { variant: "link", severity: "help", className: "text-help focus-visible:outline-help" },
      { variant: "link", severity: "danger", className: "text-destructive focus-visible:outline-destructive" },
      { variant: "link", severity: "contrast", className: "text-contrast focus-visible:outline-contrast" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** An icon set's icon (any component) or a drawn `svg`/`img`; a `span` or other text element holds the label. */
function isIconElement(node: React.ReactNode) {
  if (!React.isValidElement(node) || node.type === React.Fragment) return false
  return typeof node.type !== "string" || node.type === "svg" || node.type === "img"
}

// boolean-ui patch: while loading, the spinner takes the place of the leading icon (an icon before the label, or the
// only child of a square icon button). With no icon to replace, it sits in the middle over the label, which turns
// invisible but keeps its room and stays in the accessible name, so the button keeps its width (stock: no loading
// state).
function withSpinner(children: React.ReactNode, iconOnly: boolean) {
  const items = React.Children.toArray(children)
  const [first] = items
  if (isIconElement(first) && (items.length > 1 || iconOnly)) {
    return [<Spinner key="bui-button-spinner" />, ...items.slice(1)]
  }
  return [
    // An absolutely placed child of a flex box sits where the box centres it.
    <Spinner key="bui-button-spinner" className="absolute" />,
    <span key="bui-button-label" data-slot="button-label" className="inline-flex items-center gap-[inherit] opacity-0">
      {children}
    </span>,
  ]
}

/** @since 0.1.1 */
function Button({
  className,
  variant = "default",
  size = "default",
  severity,
  raised = false,
  rounded = false,
  fluid = false,
  loading = false,
  asChild = false,
  disabled,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /**
     * Shows the spinner in place of the leading icon, sets `aria-busy` and `aria-disabled` and ignores presses (a click,
     * Enter, Space, a form's submission), while the button keeps its focus and its place in the tab order. With
     * `asChild` the child (a link) gets the same. @since 0.1.1
     */
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const iconOnly = typeof size === "string" && size.startsWith("icon")
  // boolean-ui patch: a loading button is not `disabled`, which would drop its focus to the page and take it out of the
  // tab order; it refuses the press instead, which also stops a submit button from sending its form twice (stock: no
  // loading state).
  // boolean-ui patch: with `asChild`, a link cannot be `disabled`, so a disabled one is `aria-disabled`, leaves the tab
  // order and refuses the press, as a loading one does (stock: passes `disabled` on, which a link ignores).
  const inertChild = asChild && Boolean(disabled)
  const refuses = loading || inertChild
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (refuses) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }
  let content = children
  if (loading && !asChild) content = withSpinner(children, iconOnly)
  else if (loading && React.isValidElement<{ children?: React.ReactNode }>(children)) {
    content = React.cloneElement(children, undefined, withSpinner(children.props.children, iconOnly))
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      // boolean-ui patch: the severity, the raised and rounded flags and the loading state as attributes, for styles
      // and tests; ButtonGroup reads `data-raised` and `data-rounded` (stock: none).
      data-severity={severity ?? undefined}
      data-raised={raised || undefined}
      data-rounded={rounded || undefined}
      data-fluid={fluid || undefined}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={refuses || undefined}
      data-disabled={inertChild || undefined}
      tabIndex={inertChild ? -1 : undefined}
      disabled={disabled}
      // Only a button that refuses presses carries its own handler, so a plain Button still renders in a Server Component.
      onClick={refuses ? handleClick : onClick}
      className={cn(buttonVariants({ variant, size, severity, raised, rounded, fluid, className }))}
      {...props}
    >
      {content}
    </Comp>
  )
}

export { Button, buttonVariants }
