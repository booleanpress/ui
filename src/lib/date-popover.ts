"use client"
// The popup behaviour DatePicker and DateRangePicker share, on top of the package's Popover: focus moves into the calendar
// when a button or a key opens it (not when a click on the field does), Tab stays inside it, and closing returns focus to
// the field unless the person clicked elsewhere.

import * as React from "react"

/** How the popup was opened: by its button, by Alt+ArrowDown, or by a click on the field (focus then stays there). */
export type PickerOpenReason = "button" | "keyboard" | "field"

const TABBABLE = 'button:not([disabled]):not([tabindex="-1"]), [tabindex="0"]'

/**
 * Focuses the calendar's focusable day (the chosen one, else today, else the 1st), or a month or year cell, after the
 * popup has its place, so the browser never scrolls to where it first rendered. Returns a function that cancels it.
 */
function focusInto(content: HTMLElement | null): () => void {
  const run = () => {
    if (!content?.isConnected) return
    const target =
      content.querySelector<HTMLElement>('[data-slot=calendar] button[data-day][tabindex="0"]') ??
      content.querySelector<HTMLElement>('[role=grid] [tabindex="0"]') ??
      content.querySelector<HTMLElement>(TABBABLE)
    target?.focus({ preventScroll: true })
  }
  if (typeof window.requestAnimationFrame === "function") {
    const frame = window.requestAnimationFrame(run)
    return () => window.cancelAnimationFrame(frame)
  }
  const timer = window.setTimeout(run, 0)
  return () => window.clearTimeout(timer)
}

/** Keeps Tab inside the popup, as in a dialog: past the last control it goes to the first, and back. */
function trapTab(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return
  const items = [...event.currentTarget.querySelectorAll<HTMLElement>(TABBABLE)].filter(
    (item) => !item.closest("[aria-hidden=true]")
  )
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

/** The open state, controlled or not, and the props for the `PopoverContent` that hold the behaviour. */
export function usePickerPopover({
  open,
  defaultOpen = false,
  onOpenChange,
  anchorRef,
  returnFocusRef,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** The field: a press inside it never counts as "outside". */
  anchorRef: React.RefObject<HTMLElement | null>
  /** Where focus goes back to on close. */
  returnFocusRef: React.RefObject<HTMLElement | null>
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isOpen = open ?? uncontrolledOpen
  const reason = React.useRef<PickerOpenReason>("button")
  const pressedOutside = React.useRef(false)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  // The pending move of focus into the popup: cancelled when the popup closes first, or the picker goes away.
  const cancelFocus = React.useRef<(() => void) | null>(null)

  React.useEffect(() => () => cancelFocus.current?.(), [])

  const setOpen = (next: boolean, why: PickerOpenReason = "button") => {
    if (next) {
      reason.current = why
      pressedOutside.current = false
    }
    if (open === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const contentProps = {
    ref: contentRef,
    onOpenAutoFocus: (event: Event) => {
      event.preventDefault()
      cancelFocus.current?.()
      cancelFocus.current = reason.current !== "field" ? focusInto(contentRef.current) : null
    },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault()
      cancelFocus.current?.()
      cancelFocus.current = null
      if (!pressedOutside.current) returnFocusRef.current?.focus({ preventScroll: true })
    },
    onInteractOutside: (event: Event) => {
      if (anchorRef.current?.contains(event.target as Node)) event.preventDefault()
      else pressedOutside.current = true
    },
    onKeyDown: trapTab,
  }

  return { open: isOpen, setOpen, contentProps }
}
