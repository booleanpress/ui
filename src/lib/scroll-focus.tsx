"use client"

import * as React from "react"

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

/**
 * Makes a scrolling box reachable by keyboard when it needs to be: while its content overflows and holds nothing
 * focusable, it takes `tabIndex={0}`, so a keyboard user can focus it and scroll with the arrow keys (WCAG 2.1.1).
 * Otherwise it stays out of the tab order, and focusing the content inside scrolls it.
 */
export function useScrollFocus<T extends HTMLElement>(): { attach: (node: T | null) => void; tabIndex: 0 | undefined } {
  const [node, setNode] = React.useState<T | null>(null)
  const [focusable, setFocusable] = React.useState(false)

  React.useEffect(() => {
    if (!node || typeof ResizeObserver === "undefined") return
    const update = () => {
      const overflows = node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1
      setFocusable(overflows && !node.querySelector(FOCUSABLE))
    }
    // A ResizeObserver reports once when observing starts, then on every resize; the content's changes come through
    // the MutationObserver.
    const resize = new ResizeObserver(update)
    resize.observe(node)
    if (node.firstElementChild) resize.observe(node.firstElementChild)
    const mutation = new MutationObserver(update)
    mutation.observe(node, { childList: true, subtree: true })
    return () => {
      resize.disconnect()
      mutation.disconnect()
    }
  }, [node])

  return { attach: setNode, tabIndex: focusable ? 0 : undefined }
}

/** A `div` that scrolls, reachable by keyboard when it must be (see `useScrollFocus`). */
export function ScrollContainer(props: React.ComponentProps<"div">) {
  const { attach, tabIndex } = useScrollFocus<HTMLDivElement>()
  return <div ref={attach} tabIndex={tabIndex} {...props} />
}
