"use client"

// ActionBar: a floating toolbar for the selected items, built on Radix Toolbar (one tab stop, the arrow keys between its
// buttons) and the library's presence hook (it rises in and fades out).

import * as React from "react"
import { XIcon } from "lucide-react"
import { Toolbar as ToolbarPrimitive } from "radix-ui"
import { cn, fillString } from "@/lib/utils"
import { usePresence } from "@/lib/presence"

import { Button } from "@/components/button"
import type { ReturnFocusTarget } from "@/lib/return-focus"
import { useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

const isLost = (element: Element | null) => !element || element === document.body || !element.isConnected

/** The child of `<body>` that holds `node` (a portal's container, or the app's root), or the top of a removed tree. */
function topLevel(node: Node) {
  let current = node
  while (current.parentNode && current.parentNode !== document.body) current = current.parentNode
  return current
}

/**
 * The bar: "{count} selected", your actions and a clear-selection button. It shows while `count` is above zero.
 *
 * @since 0.1.0
 */
function ActionBar({
  className,
  count,
  open,
  onClear,
  position = "container",
  returnFocusTo,
  children,
  "aria-label": ariaLabel,
  onFocus,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof ToolbarPrimitive.Root>, "orientation"> & {
  /** How many items are selected: shown as "{count} selected", announced politely, and the bar shows while it is above 0. */
  count: number
  /** Shows or hides the bar whatever `count` is. */
  open?: boolean
  /** Renders the × button, which should empty the selection. */
  onClear?: () => void
  /**
   * `container` floats it 1rem above the bottom of the nearest positioned ancestor (give the list's wrapper
   * `relative`); `viewport` floats it above the bottom of the window.
   */
  position?: "container" | "viewport"
  /**
   * Where focus goes when the bar closes with focus in it and the element focused before it is gone. By default focus
   * goes back to the element it came from.
   */
  returnFocusTo?: ReturnFocusTarget
}) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const shown = open ?? count > 0
  const countText = fillString(strings.selectedCount, { count: new Intl.NumberFormat(locale).format(count) })
  const barRef = React.useRef<HTMLDivElement | null>(null)
  const setBarRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      barRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  // Stays on the page while it fades out.
  const presence = usePresence(shown, barRef)
  // The element focus came from when it entered the bar.
  const cameFrom = React.useRef<Element | null>(null)
  // Where the bar's menus render (portals elsewhere in the page), learnt from the focus React brings from them.
  const portals = React.useRef(new WeakSet<Node>())
  const wasShown = React.useRef(shown)

  const returnFocus = React.useCallback(() => {
    const target = isLost(cameFrom.current)
      ? typeof returnFocusTo === "function"
        ? returnFocusTo()
        : returnFocusTo?.current
      : (cameFrom.current as HTMLElement)
    target?.focus()
  }, [returnFocusTo])

  const returnFocusRef = React.useRef(returnFocus)
  React.useEffect(() => {
    returnFocusRef.current = returnFocus
  })

  // Closing with focus inside (Clear, an action that empties the selection, or an item of a menu of the bar) would drop
  // focus on the page: send it back to where it came from.
  React.useEffect(() => {
    const closing = wasShown.current && !shown
    wasShown.current = shown
    if (!closing) return
    const holdsFocus = () => {
      const active = document.activeElement
      return Boolean(barRef.current?.contains(active)) || isLost(active) || portals.current.has(topLevel(active as Element))
    }
    if (!holdsFocus()) return
    // A menu item that emptied the selection still holds focus inside its menu, which keeps it until it has closed,
    // later in the same task: move focus once the menu has let go.
    const timer = window.setTimeout(() => {
      if (holdsFocus()) returnFocusRef.current()
    })
    return () => window.clearTimeout(timer)
  }, [shown])

  return (
    <>
      {/* Always on the page, so the count is announced when the bar appears and when it changes. */}
      <span data-slot="action-bar-status" role="status" className="sr-only">
        {shown ? countText : ""}
      </span>
      {presence.mounted && (
        <ToolbarPrimitive.Root
          ref={setBarRef}
          data-slot="action-bar"
          data-state={presence.state}
          data-position={position}
          data-bui-motion="overlay"
          orientation="horizontal"
          aria-label={ariaLabel ?? countText}
          onFocus={(event) => {
            onFocus?.(event)
            // Focus that reaches the bar while it fades out (a menu of the bar handing it back to its trigger) would be
            // lost when the bar goes: pass it on at once.
            const bar = event.currentTarget
            if (!shown && bar.contains(event.target)) {
              returnFocus()
              return
            }
            // React brings here the focus of a menu opened from the bar, though the menu renders elsewhere in the page:
            // remember that place, so a move between it and the bar is not focus entering the bar.
            if (!bar.contains(event.target)) {
              const place = topLevel(event.target)
              if (!place.contains(bar)) portals.current.add(place)
            }
            const from = event.relatedTarget
            if (from && !bar.contains(from) && !portals.current.has(topLevel(from))) cameFrom.current = from
          }}
          className={cn(
            // A floating surface: the overlay fill, edge and shadow, 8px radius, 0.375rem round its buttons.
            "inset-x-0 bottom-4 mx-auto flex w-max max-w-[calc(100%-2rem)] items-center gap-1 rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-md",
            position === "viewport" ? "fixed z-50" : "absolute z-10",
            // A bar fading out takes no more clicks.
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:pointer-events-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            className
          )}
          {...props}
        >
          <span data-slot="action-bar-count" className="px-2 text-sm/normal font-medium whitespace-nowrap">
            {countText}
          </span>
          <ActionBarSeparator />
          {children}
          {onClear && (
            <>
              <ActionBarSeparator />
              <ToolbarPrimitive.Button asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-slot="action-bar-clear"
                  aria-label={strings.clearSelection}
                  onClick={onClear}
                  className="rounded-full text-muted-foreground hover:text-accent-foreground"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              </ToolbarPrimitive.Button>
            </>
          )}
        </ToolbarPrimitive.Root>
      )}
    </>
  )
}

/**
 * An action of the bar: the library's Button, a text button by default, in the bar's arrow-key order.
 *
 * @since 0.1.0
 */
function ActionBarButton({
  className,
  variant = "ghost",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "asChild">) {
  return (
    <ToolbarPrimitive.Button asChild>
      <Button
        type="button"
        data-slot="action-bar-button"
        variant={variant}
        className={cn(variant === "ghost" && !props.severity && "text-foreground", className)}
        {...props}
      />
    </ToolbarPrimitive.Button>
  )
}

/**
 * A thin vertical line between groups of the bar.
 *
 * @since 0.1.0
 */
function ActionBarSeparator({ className, ...props }: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="action-bar-separator"
      className={cn("mx-0.5 h-5 w-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

export { ActionBar, ActionBarButton, ActionBarSeparator }
