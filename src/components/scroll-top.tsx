"use client"

// ScrollTop: no primitive. A round button that appears once the window, or the box it sits in, has scrolled past a
// threshold, and scrolls back to the top.

import * as React from "react"
import { ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/button"
import { useUiStrings } from "@booleanpress/ui/provider"

type Phase = "hidden" | "visible" | "leaving"

/**
 * Focuses `node`, a scrolled box or the page's body, without scrolling. One that cannot take focus takes it for the
 * moment (`tabindex="-1"`, no outline), until focus moves on.
 */
function focusStart(node: HTMLElement) {
  if (node.hasAttribute("tabindex")) {
    node.focus({ preventScroll: true })
    return
  }
  const outline = node.style.outline
  node.setAttribute("tabindex", "-1")
  node.style.outline = "none"
  node.addEventListener(
    "blur",
    () => {
      node.removeAttribute("tabindex")
      node.style.outline = outline
    },
    { once: true }
  )
  node.focus({ preventScroll: true })
}

/** @since 0.1.0 */
function ScrollTop({
  className,
  target = "window",
  threshold = 400,
  behavior = "smooth",
  icon,
  children,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> & {
  /**
   * What it watches and scrolls: `window` (default), shown fixed in the window's bottom corner; or `parent`, the
   * scrolling box it is placed in, at the end of the box's content, where it sticks to the box's bottom corner.
   */
  target?: "window" | "parent"
  /** How far, in px, the target must scroll down before the button appears. 400 by default. */
  threshold?: number
  /** `smooth` (default) or `auto` (a jump). With reduced motion the scroll always jumps. */
  behavior?: ScrollBehavior
  /** Replaces the chevron. */
  icon?: React.ReactNode
}) {
  const strings = useUiStrings()
  const anchorRef = React.useRef<HTMLSpanElement>(null)
  const [phase, setPhase] = React.useState<Phase>("hidden")

  const getTarget = React.useCallback((): HTMLElement | Window | null => {
    if (target === "window") return typeof window === "undefined" ? null : window
    return anchorRef.current?.parentElement ?? null
  }, [target])

  React.useEffect(() => {
    const scroller = getTarget()
    if (!scroller) return
    const update = () => {
      const top = scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop
      setPhase((current) => {
        if (top > threshold) return "visible"
        return current === "hidden" ? "hidden" : "leaving"
      })
    }
    update()
    scroller.addEventListener("scroll", update, { passive: true })
    return () => scroller.removeEventListener("scroll", update)
  }, [getTarget, threshold])

  // The exit fades out; the button leaves when the fade ends (or soon after, where animations do not run).
  React.useEffect(() => {
    if (phase !== "leaving") return
    const timer = window.setTimeout(() => setPhase("hidden"), 400)
    return () => window.clearTimeout(timer)
  }, [phase])

  const scrollToTop = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    const scroller = getTarget()
    if (!scroller) return
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    scroller.scrollTo({ top: 0, behavior: reduced ? "auto" : behavior })
    // The button is about to leave: focus moves to the top of what it scrolled, so it does not fall to the page where
    // the button was, and the next Tab starts from the top.
    if (event.currentTarget === document.activeElement) {
      focusStart(scroller === window ? document.body : (scroller as HTMLElement))
    }
  }

  const visible = phase === "visible"

  return (
    <>
      {target === "parent" ? <span ref={anchorRef} data-slot="scroll-top-anchor" hidden /> : null}
      {phase === "hidden" ? null : (
        <Button
          data-slot="scroll-top"
          data-state={visible ? "open" : "closed"}
          data-target={target}
          // The overlay motion: a fade at the base duration in, the exit duration out, set by theme.css.
          data-bui-motion="overlay"
          size="icon"
          rounded
          aria-label={ariaLabel ?? strings.scrollToTop}
          aria-hidden={visible ? undefined : true}
          tabIndex={visible ? undefined : -1}
          onClick={scrollToTop}
          onAnimationEnd={() => {
            if (!visible) setPhase("hidden")
          }}
          className={cn(
            // A 48px circle with a 24px icon, 20px from the bottom and end edges.
            "z-40 size-12 animate-in fade-in-0 data-[state=closed]:pointer-events-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 [&_svg:not([class*='size-'])]:size-6",
            target === "window" ? "fixed end-5 bottom-5" : "sticky bottom-5 ms-auto flex",
            className
          )}
          {...props}
        >
          {children ?? icon ?? <ChevronUpIcon aria-hidden="true" />}
        </Button>
      )}
    </>
  )
}

export { ScrollTop }
