import * as React from "react"
import { shareNode } from "@/lib/refs"

// Whether a scroll by the deltas, along their main axis, moves an element from `target` up to `root`.
function scrollsInside(root: Element, target: EventTarget | null, deltaX: number, deltaY: number) {
  const vertical = Math.abs(deltaY) >= Math.abs(deltaX)
  const delta = vertical ? deltaY : deltaX
  if (delta === 0) return false
  for (let node = target instanceof Element ? target : null; node; node = node === root ? null : node.parentElement) {
    const overflow = getComputedStyle(node)[vertical ? "overflowY" : "overflowX"]
    if (overflow !== "auto" && overflow !== "scroll" && overflow !== "overlay") continue
    const room = vertical ? node.scrollHeight - node.clientHeight : node.scrollWidth - node.clientWidth
    if (room < 1) continue
    // Sideways, any room will do: which way is the start depends on the direction of the text.
    if (!vertical) return true
    if (delta > 0 ? node.scrollTop < room - 0.5 : node.scrollTop > 0.5) return true
  }
  return false
}

/** Lets the wheel and touch scroll an overlay portalled out of a modal dialog or sheet. A ref: React runs its cleanup. */
// The dialog's scroll lock listens on the document and cancels a scroll outside the dialog's own element, which the
// overlay, rendered in <body>, is. This stops, on the overlay, the events that scroll something inside it, so the lock
// never sees them, wherever the app's React root is; an event that would scroll nothing inside still reaches the lock,
// which keeps the page behind the dialog still. An overlay with a scroll lock of its own (a modal menu) behaves as before.
export function keepScrollFromDialogLock(node: HTMLElement | null) {
  if (!node) return
  let start = { x: 0, y: 0 }
  const onWheel = (event: WheelEvent) => {
    if (scrollsInside(node, event.target, event.deltaX, event.deltaY)) event.stopPropagation()
  }
  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (touch) start = { x: touch.clientX, y: touch.clientY }
  }
  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (event.touches.length !== 1 || !touch) return
    if (scrollsInside(node, event.target, start.x - touch.clientX, start.y - touch.clientY)) event.stopPropagation()
  }
  const options = { passive: true }
  node.addEventListener("wheel", onWheel, options)
  node.addEventListener("touchstart", onTouchStart, options)
  node.addEventListener("touchmove", onTouchMove, options)
  return () => {
    node.removeEventListener("wheel", onWheel)
    node.removeEventListener("touchstart", onTouchStart)
    node.removeEventListener("touchmove", onTouchMove)
  }
}

/** A ref that runs `keepScrollFromDialogLock` on the element and passes the element on to `ref`. */
export function useKeepScrollFromDialogLock<T extends HTMLElement>(ref: React.Ref<T> | undefined) {
  return React.useCallback(
    (node: T | null) => {
      if (!node) return
      const release = keepScrollFromDialogLock(node)
      const share = shareNode(node, [ref])
      return () => {
        release?.()
        share()
      }
    },
    [ref]
  )
}
