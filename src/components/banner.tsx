"use client"

// Banner: a full-width, page-level message with an optional icon, actions and dismiss button. Built on plain elements.

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import type { ReturnFocusTarget } from "@/lib/return-focus"
import { useUiStrings } from "@booleanpress/ui/provider"

// The tones are the Message colours of the visual target (the library's Alert): a subtle fill, a matching edge and
// strong text in one hue; `neutral` is the secondary surface.
const bannerVariants = cva(
  "group/banner flex w-full items-start gap-2 border-b px-4 py-2.5 text-sm/normal",
  {
    variants: {
      tone: {
        neutral: "border-border bg-secondary text-secondary-foreground",
        info: "border-info-border bg-info-subtle text-info-strong",
        success: "border-success-border bg-success-subtle text-success-strong",
        warning: "border-warning-border bg-warning-subtle text-warning-strong",
        destructive: "border-destructive-border bg-destructive-subtle text-destructive-strong",
      },
      position: {
        static: "",
        // Sticks to the top of the scrolling box, above the content that scrolls under it.
        sticky: "sticky top-0 z-10",
      },
    },
    defaultVariants: { tone: "info", position: "static" },
  }
)

const DEFAULT_ICONS = {
  neutral: InfoIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  destructive: CircleAlertIcon,
} as const

const TABBABLE =
  'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Whether Tab can reach `element`: not hidden, inert or out of the rendering (a closed panel, `display: none`). */
function reachable(element: HTMLElement) {
  if (element.closest("[hidden], [inert]")) return false
  return typeof element.checkVisibility === "function" ? element.checkVisibility({ visibilityProperty: true }) : true
}

/**
 * Where focus goes when `node` leaves the page: the first element after it that Tab reaches, or, when nothing follows
 * it, the last one before it.
 */
function neighbourTabbable(node: Element) {
  const candidates = Array.from(document.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (element) => !node.contains(element) && reachable(element)
  )
  const after = (element: Element) => Boolean(node.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
  return candidates.find(after) ?? candidates.filter((element) => !after(element)).pop()
}

/**
 * A page-level message across the full width of its container.
 *
 * @since 0.1.1
 */
function Banner({
  className,
  tone = "info",
  position = "static",
  icon,
  dismissible = false,
  onDismiss,
  returnFocusTo,
  role,
  ref,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bannerVariants> & {
    /** The icon before the text. Each tone has its own; pass another, or `null` for none. */
    icon?: React.ReactNode
    /** Render a × button that removes the banner. */
    dismissible?: boolean
    /** Called when the × removes the banner. */
    onDismiss?: () => void
    /**
     * Where focus goes when the × removes the banner. By default, the first element after the banner that Tab reaches
     * (the last one before it when nothing follows). Read once the banner has gone, so it can name an element that the
     * dismissal itself shows, such as a "Show again" button.
     */
    returnFocusTo?: ReturnFocusTarget
  }) {
  const strings = useUiStrings()
  const [dismissed, setDismissed] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  // Set by the ×: the element focus falls back to, found while the banner still marks its place in the page; `null`
  // when focus was elsewhere and stays there.
  const focusAfter = React.useRef<{ fallback: HTMLElement | undefined } | null>(null)
  const resolvedTone = tone ?? "info"
  const Icon = DEFAULT_ICONS[resolvedTone]

  // Once the banner has gone (and whatever the dismissal showed is on the page), move focus on.
  React.useEffect(() => {
    const pending = focusAfter.current
    if (!dismissed || !pending) return
    focusAfter.current = null
    const target = (typeof returnFocusTo === "function" ? returnFocusTo() : returnFocusTo?.current) ?? pending.fallback
    target?.focus()
  }, [dismissed, returnFocusTo])

  if (dismissed) return null

  const dismiss = () => {
    const root = rootRef.current
    const active = document.activeElement
    // Focus moves only when it was on the × (or nowhere): a pointer click that left focus elsewhere keeps it there.
    const focusInside = !active || active === document.body || Boolean(root?.contains(active))
    focusAfter.current = focusInside ? { fallback: root ? neighbourTabbable(root) : undefined } : null
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      ref={setRootRef}
      data-slot="banner"
      data-tone={resolvedTone}
      data-position={position}
      // Warnings and errors are alerts; the other tones are a polite status.
      role={role ?? (resolvedTone === "warning" || resolvedTone === "destructive" ? "alert" : "status")}
      className={cn(bannerVariants({ tone: resolvedTone, position }), className)}
      {...props}
    >
      {icon !== null && (
        <span
          data-slot="banner-icon"
          aria-hidden="true"
          // On the first line of text: 21px, or the 28px of the row a small button sets when there are actions.
          className="flex h-5.25 shrink-0 items-center group-has-data-[slot=banner-actions]/banner:h-7 [&_svg:not([class*='size-'])]:size-4"
        >
          {icon ?? <Icon />}
        </span>
      )}
      <div data-slot="banner-content" className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5">
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          data-slot="banner-dismiss"
          aria-label={strings.dismiss}
          onClick={dismiss}
          // The visual target's Message close button: a 24 px circle in the text colour, a faint fill on hover, centred on
          // the first line of text (21px, or 28px with actions).
          className="-me-1 -my-[1.5px] flex size-6 group-has-data-[slot=banner-actions]/banner:my-0.5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:bg-current/10 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current focus-visible:outline-solid [&_svg]:size-3.5"
        >
          <XIcon aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/** With actions, the text is padded to the 28px of their small buttons, so its first line, the icon and the buttons share a centre. */
const actionRow = "group-has-data-[slot=banner-actions]/banner:py-[0.21875rem]"

/**
 * The banner's heading, in medium weight.
 *
 * @since 0.1.1
 */
function BannerTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="banner-title" className={cn("font-medium", actionRow, className)} {...props} />
}

/**
 * The banner's text, after the title on the same line when there is room.
 *
 * @since 0.1.1
 */
function BannerDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="banner-description" className={cn("min-w-0 flex-1 basis-60", actionRow, className)} {...props} />
}

/**
 * The banner's buttons or links, at the end of its text.
 *
 * @since 0.1.1
 */
function BannerActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="banner-actions" className={cn("ms-auto flex shrink-0 flex-wrap items-center gap-2", className)} {...props} />
}

export { Banner, BannerTitle, BannerDescription, BannerActions, bannerVariants }
