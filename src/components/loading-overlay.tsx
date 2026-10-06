"use client"

// LoadingOverlay: a mask with a spinner over a region, or over the whole window, while it is busy. Built on plain
// elements, the `inert` attribute and the library's presence hook (it fades in and out).

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { usePresence } from "@/lib/presence"

import { Spinner } from "@/components/spinner"
import { useUiStrings } from "@booleanpress/ui/provider"

const noSubscription = () => () => {}

// Counters kept on the elements themselves, so overlays that block at the same time (or two copies of the library on one
// page) share them: an element is released only when the last overlay that blocked it ends.
const INERT_COUNT = "data-bui-inert"
const SCROLL_LOCK_COUNT = "data-bui-scroll-lock"
const SCROLL_LOCK_RESTORE = "data-bui-scroll-lock-restore"

/**
 * Makes every child of `<body>` inert except the loading overlays' own parts; an element that was inert already is left
 * alone. Returns the undo.
 */
function inertOutside() {
  const changed: Element[] = []
  for (const element of Array.from(document.body.children)) {
    if (element instanceof HTMLScriptElement || element.matches("[data-slot^=loading-overlay]")) continue
    const count = Number(element.getAttribute(INERT_COUNT) ?? 0)
    if (count === 0 && element.hasAttribute("inert")) continue
    element.setAttribute(INERT_COUNT, String(count + 1))
    element.setAttribute("inert", "")
    changed.push(element)
  }
  return () => {
    for (const element of changed) {
      const count = Number(element.getAttribute(INERT_COUNT) ?? 1) - 1
      if (count > 0) {
        element.setAttribute(INERT_COUNT, String(count))
      } else {
        element.removeAttribute(INERT_COUNT)
        element.removeAttribute("inert")
      }
    }
  }
}

/**
 * Stops the page scrolling under the full-screen mask: `overflow: hidden` on `<html>`, keeping the scrollbar's gutter
 * where the window has one, so nothing shifts. Returns the undo, which puts back the page's own inline values.
 */
function lockScroll() {
  const html = document.documentElement
  const count = Number(html.getAttribute(SCROLL_LOCK_COUNT) ?? 0)
  if (count === 0) {
    const hasScrollbar = window.innerWidth > html.clientWidth
    html.setAttribute(SCROLL_LOCK_RESTORE, JSON.stringify([html.style.overflow, html.style.scrollbarGutter]))
    html.style.overflow = "hidden"
    if (hasScrollbar) html.style.scrollbarGutter = "stable"
  }
  html.setAttribute(SCROLL_LOCK_COUNT, String(count + 1))
  return () => {
    const left = Number(html.getAttribute(SCROLL_LOCK_COUNT) ?? 1) - 1
    if (left > 0) {
      html.setAttribute(SCROLL_LOCK_COUNT, String(left))
      return
    }
    let restore: string[] = []
    try {
      restore = JSON.parse(html.getAttribute(SCROLL_LOCK_RESTORE) ?? "[]")
    } catch {
      // A value written by someone else: fall back to no inline style.
    }
    html.style.overflow = restore[0] ?? ""
    html.style.scrollbarGutter = restore[1] ?? ""
    html.removeAttribute(SCROLL_LOCK_COUNT)
    html.removeAttribute(SCROLL_LOCK_RESTORE)
  }
}

function Mask({
  ref,
  state,
  fullScreen,
  label,
  indicator,
}: {
  ref?: React.Ref<HTMLDivElement>
  state: "open" | "closed"
  fullScreen: boolean
  label?: string
  indicator?: React.ReactNode
}) {
  return (
    <div
      ref={ref}
      data-slot="loading-overlay-mask"
      data-state={state}
      data-bui-motion="overlay"
      className={cn(
        // The visual target's block mask: the mask token over the region, its corners following the region's.
        "flex items-center justify-center bg-mask data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        fullScreen ? "fixed inset-0 z-50" : "absolute inset-0 z-10 rounded-[inherit]"
      )}
    >
      {/* What sighted people see; the status below says it to everyone else. */}
      <div
        data-slot="loading-overlay-indicator"
        aria-hidden="true"
        className="flex items-center gap-2 rounded-lg bg-popover p-2.5 text-sm/normal text-popover-foreground shadow-md has-data-[slot=loading-overlay-label]:px-3 has-data-[slot=loading-overlay-label]:py-2"
      >
        {indicator ?? <Spinner className="size-5" />}
        {label && <span data-slot="loading-overlay-label">{label}</span>}
      </div>
    </div>
  )
}

/**
 * Blocks its content while `loading`: a mask with a spinner covers it, the content is `inert` and `aria-busy`, and the
 * label (or the provider's `loading`) is announced politely. With `fullScreen` the mask covers the whole window.
 *
 * @since 0.1.1
 */
function LoadingOverlay({
  className,
  loading = false,
  fullScreen = false,
  label,
  indicator,
  ref,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Blocks the content and shows the mask. */
  loading?: boolean
  /** Covers the whole window instead of the content, makes the rest of the page inert and stops it scrolling. */
  fullScreen?: boolean
  /** Text beside the spinner, announced politely when loading starts ("Saving the mailer…"). */
  label?: string
  /** Something to show in place of the spinner, such as a `ProgressCircle`. */
  indicator?: React.ReactNode
}) {
  const strings = useUiStrings()
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  // The portal exists only in the browser; the server renders the region alone.
  const hydrated = React.useSyncExternalStore(noSubscription, () => true, () => false)
  const announcement = loading ? (label ?? strings.loading) : ""
  // The mask stays on the page while it fades out.
  const maskRef = React.useRef<HTMLDivElement>(null)
  const mask = usePresence(loading, maskRef)

  // Full screen: everything else on the page is inert, and does not scroll, while it loads.
  React.useEffect(() => {
    if (!fullScreen || !loading) return
    const release = inertOutside()
    const unlock = lockScroll()
    return () => {
      release()
      unlock()
    }
  }, [fullScreen, loading])

  // Blocking blurs the focused control inside: it gets focus back when the content is usable again. (Declared after the
  // effect above, so its cleanup runs once the page is no longer inert.)
  React.useEffect(() => {
    if (!loading) return
    const scope = fullScreen ? document.body : rootRef.current
    const active = document.activeElement
    const before = active instanceof HTMLElement && active !== document.body && scope?.contains(active) ? active : null
    return () => {
      const now = document.activeElement
      if (before?.isConnected && (!now || now === document.body)) before.focus()
    }
  }, [loading, fullScreen])

  // Full screen: the status stays on the page so its text is announced; the mask joins the end of `<body>` when loading
  // starts, above any dialog or menu opened before it.
  const portal =
    fullScreen && hydrated ? (
      <>
        {createPortal(
          <div data-slot="loading-overlay-portal">
            <span role="status" className="sr-only">
              {announcement}
            </span>
          </div>,
          document.body
        )}
        {mask.mounted &&
          createPortal(
            <Mask ref={maskRef} state={mask.state} fullScreen label={label} indicator={indicator} />,
            document.body
          )}
      </>
    ) : null

  if (fullScreen && children == null) return portal

  return (
    <div
      ref={setRootRef}
      data-slot="loading-overlay"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={cn("relative rounded-md", className)}
      {...props}
    >
      <div data-slot="loading-overlay-content" inert={loading || undefined}>
        {children}
      </div>
      {!fullScreen && (
        <>
          {mask.mounted && (
            <Mask ref={maskRef} state={mask.state} fullScreen={false} label={label} indicator={indicator} />
          )}
          <span role="status" className="sr-only">
            {announcement}
          </span>
        </>
      )}
      {portal}
    </div>
  )
}

export { LoadingOverlay }
