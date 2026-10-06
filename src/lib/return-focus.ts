import * as React from "react"

/**
 * Where focus goes when an overlay closes and the element that opened it is gone: a ref, or a function that returns
 * the element.
 *
 * @since 0.1.1
 */
export type ReturnFocusTarget = React.RefObject<HTMLElement | null> | (() => HTMLElement | null)

type AutoFocusHandler = (event: Event) => void

const isLost = (element: Element | null) => !element || element === document.body || !element.isConnected

const resolve = (target: ReturnFocusTarget | undefined) =>
  typeof target === "function" ? target() : target?.current

/**
 * Starts recording where the page tries to move focus outside an open overlay, and returns a function that stops and
 * gives the first of those elements still on the page.
 *
 * An overlay opened from a menu item (a dialog, a confirmation) outlives the menu: the menu closes, its item leaves the
 * page, and the menu sends focus back to its own trigger, which the overlay's focus trap turns away. That trigger is
 * where focus belongs when the overlay closes, so it is kept here. Elements of the overlay itself (`isInside`) and
 * Radix's focus guards are not recorded.
 *
 * @since 0.1.1
 */
export function watchFocusHandoff(isInside: (element: Element) => boolean): () => HTMLElement | null {
  if (typeof document === "undefined") return () => null
  const seen: HTMLElement[] = []
  const record = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement) || isInside(target) || target.hasAttribute("data-radix-focus-guard")) return
    if (!seen.includes(target)) seen.push(target)
  }
  // A trap turns focus back while the overlay's element is losing it, so the element that was to receive it never
  // sees a `focusin`: it is the `relatedTarget` of the `focusout`. Capture listeners run before the trap's.
  const onFocusIn = (event: FocusEvent) => record(event.target)
  const onFocusOut = (event: FocusEvent) => record(event.relatedTarget)
  document.addEventListener("focusin", onFocusIn, true)
  document.addEventListener("focusout", onFocusOut, true)
  return () => {
    document.removeEventListener("focusin", onFocusIn, true)
    document.removeEventListener("focusout", onFocusOut, true)
    return seen.find((element) => !isLost(element)) ?? null
  }
}

/**
 * An `onCloseAutoFocus` handler for the overlay contents (Dialog, AlertDialog, Sheet) that never lets focus fall to
 * `<body>` when the overlay closes. Radix returns focus to the overlay's trigger; when there is none, or it is gone,
 * focus would be lost and a keyboard or screen-reader user would lose their place. Then focus goes to:
 *
 * 1. the element that had focus when the overlay opened, if it is still on the page — the button that opened a dialog
 *    from code (`open` state) rather than through a trigger, or the row button of a cancelled delete confirmation;
 * 2. otherwise the element the page tried to focus while the overlay was open, if it is still on the page — the
 *    trigger of the menu whose item opened the overlay (see `watchFocusHandoff`);
 * 3. otherwise `returnFocusTo`, when given — the product's choice for when those are gone too, for example after the
 *    dialog deleted the table row it sat in.
 *
 * Pass both returned handlers to the Radix content: `onOpenAutoFocus` records the opener as the overlay opens, before
 * focus moves into it.
 *
 * @since 0.1.1
 * @since 0.1.1 Falls back to the element that had focus when the overlay opened; returns both handlers.
 * @since 0.1.1 Falls back to the trigger of the menu whose item opened the overlay.
 *
 * @param returnFocusTo Where focus goes when it would otherwise be lost.
 * @param handlers The consumer's own handlers, called first.
 */
export function useReturnFocus(
  returnFocusTo: ReturnFocusTarget | undefined,
  { onOpenAutoFocus, onCloseAutoFocus }: { onOpenAutoFocus?: AutoFocusHandler; onCloseAutoFocus?: AutoFocusHandler } = {}
): { onOpenAutoFocus: AutoFocusHandler; onCloseAutoFocus: AutoFocusHandler } {
  const opener = React.useRef<Element | null>(null)
  const stopWatching = React.useRef<(() => HTMLElement | null) | null>(null)

  // Unmounted while open (its parent went away): stop listening.
  React.useEffect(() => () => void stopWatching.current?.(), [])

  const handleOpen = React.useCallback(
    (event: Event) => {
      opener.current = document.activeElement
      stopWatching.current?.()
      // Radix dispatches the event on the overlay's content element.
      const content = event.currentTarget instanceof Element ? event.currentTarget : null
      stopWatching.current = watchFocusHandoff((element) => !!content?.contains(element))
      onOpenAutoFocus?.(event)
    },
    [onOpenAutoFocus]
  )

  const handleClose = React.useCallback(
    (event: Event) => {
      const handoff = stopWatching.current?.() ?? null
      stopWatching.current = null
      onCloseAutoFocus?.(event)
      if (event.defaultPrevented) return
      // Radix moves focus to the trigger right after this handler, in the same task; check once it has.
      queueMicrotask(() => {
        if (!isLost(document.activeElement)) return
        const target = !isLost(opener.current)
          ? (opener.current as HTMLElement)
          : !isLost(handoff)
            ? handoff
            : resolve(returnFocusTo)
        target?.focus({ preventScroll: false })
      })
    },
    [returnFocusTo, onCloseAutoFocus]
  )

  return { onOpenAutoFocus: handleOpen, onCloseAutoFocus: handleClose }
}
