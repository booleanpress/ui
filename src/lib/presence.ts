"use client"

import * as React from "react"

/**
 * Whether an element shows (`open`) or is leaving (`closed`): give it to the element as `data-state`, which theme.css
 * animates.
 *
 * @since 0.1.0
 */
export type PresenceState = "open" | "closed"

const milliseconds = (value: string) => {
  const number = Number.parseFloat(value)
  if (!Number.isFinite(number)) return 0
  return value.trim().endsWith("ms") ? number : number * 1000
}

/** The longest entry of a computed animation or transition list, delay included; CSS repeats a shorter list. */
function longest(durations: string, delays: string, names?: string, iterations?: string) {
  const delayList = (delays || "0s").split(",")
  const nameList = names?.split(",")
  const iterationList = iterations?.split(",")
  return (durations || "0s").split(",").reduce((max, duration, i) => {
    const name = nameList?.[i % nameList.length].trim()
    const count = iterationList?.[i % iterationList.length].trim() ?? "1"
    // No animation, or one that never ends and so is not an exit.
    if (name === "none" || name === "" || count === "infinite") return max
    const runs = Number.parseFloat(count) || 1
    return Math.max(max, milliseconds(duration) * runs + milliseconds(delayList[i % delayList.length]))
  }, 0)
}

/** How long the element's exit runs, in milliseconds, from its computed style: 0 when nothing animates. */
function exitDuration(element: Element) {
  const style = getComputedStyle(element)
  const animation = longest(style.animationDuration, style.animationDelay, style.animationName || "none", style.animationIterationCount)
  const transition = longest(style.transitionDuration, style.transitionDelay)
  // Where the browser lists what really runs, a declared duration with nothing running is no exit.
  const running = typeof element.getAnimations === "function" ? element.getAnimations().length > 0 : true
  return running ? Math.max(animation, transition) : 0
}

/**
 * Keeps an element on the page while it animates out: `mounted` is true while `open`, and after `open` turns false
 * until the element's `animationend` or `transitionend`, or at once when it has no exit animation. Under reduced motion
 * the exit is whatever theme.css leaves of it (a short fade on overlays), read from the element's computed style. `state` is `open` or `closed`, for the element's `data-state`. `ref` is the element's ref, which
 * the hook reads to watch its animation.
 *
 * @since 0.1.0
 */
export function usePresence(open: boolean, ref: React.RefObject<Element | null>) {
  const [exiting, setExiting] = React.useState(false)
  const [wasOpen, setWasOpen] = React.useState(open)
  // Closing starts the exit; opening again stops it.
  if (wasOpen !== open) {
    setWasOpen(open)
    setExiting(!open)
  }

  // A layout effect, so an element with no exit leaves before the closed state is painted.
  React.useLayoutEffect(() => {
    if (!exiting) return
    const element = ref.current
    const duration = element ? exitDuration(element) : 0
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setExiting(false)
    }
    if (!element || duration === 0) {
      finish()
      return
    }
    const onEnd = (event: Event) => {
      if (event.target !== element) return
      // An entrance cut short by the exit ends with `animationcancel` under its own name: not the exit.
      const name = (event as AnimationEvent).animationName
      if (name && !getComputedStyle(element).animationName.split(",").some((n) => n.trim() === name)) return
      finish()
    }
    const events = ["animationend", "animationcancel", "transitionend"] as const
    for (const type of events) element.addEventListener(type, onEnd)
    // In case the end event never comes (the element is hidden, the tab in the background).
    const timer = window.setTimeout(finish, duration + 50)
    return () => {
      for (const type of events) element.removeEventListener(type, onEnd)
      window.clearTimeout(timer)
    }
  }, [exiting, ref])

  return { mounted: open || exiting, state: (open ? "open" : "closed") as PresenceState }
}
