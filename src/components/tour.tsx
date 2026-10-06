"use client"

// Tour: built on Radix Popover. A card that walks through a sequence of steps, each anchored to an element of the
// page, with Next, Back and Skip; an optional spotlight mask dims the page around the current element.

import * as React from "react"
import { Popover as PopoverPrimitive, Portal as PortalPrimitive } from "radix-ui"
import { cn, fillString } from "@/lib/utils"

import { Button } from "@/components/button"
import { useReturnFocus, type ReturnFocusTarget } from "@/lib/return-focus"
import { useUiConfig, useUiLocale } from "@booleanpress/ui/provider"

/**
 * What a step points at: a CSS selector, a ref, or a function that returns the element. Left out, the card sits in
 * the middle of the window.
 *
 * @since 0.1.1
 */
type TourTarget = string | React.RefObject<Element | null> | (() => Element | null)

/**
 * One step of a tour.
 *
 * @since 0.1.1
 */
interface TourStep {
  /** The element the card points at. Left out, or not on the page, the card sits in the middle of the window. */
  target?: TourTarget
  /** The card's heading: it names the card for assistive technology. */
  title: React.ReactNode
  /** The explanation under the title: it describes the card for assistive technology. */
  description?: React.ReactNode
  /** Anything else under the description: an image, a list of shortcuts, a link. */
  content?: React.ReactNode
  /** The side of the target the card goes on: `top`, `right`, `bottom` (default) or `left`; it flips when there is no room. */
  placement?: "top" | "right" | "bottom" | "left"
  /** Its alignment along that side: `start`, `center` (default) or `end`. */
  align?: "start" | "center" | "end"
}

type Measurable = { getBoundingClientRect(): DOMRect }

function resolveTarget(target: TourTarget | undefined): Element | null {
  if (!target || typeof document === "undefined") return null
  if (typeof target === "string") return document.querySelector(target)
  if (typeof target === "function") return target()
  return target.current
}

/** Whether the element lies wholly inside the window. */
function inView(element: Element) {
  const rect = element.getBoundingClientRect()
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
}

/**
 * The dimmed layer: the mask colour over the whole window, with a rounded hole over the target. The hole is moved by
 * setting its attributes, so following a scroll does not re-render anything.
 */
function TourMask({
  open,
  getTarget,
  padding,
  radius,
  onExited,
}: {
  open: boolean
  getTarget: () => Element | null
  padding: number
  radius: number
  onExited: () => void
}) {
  const id = `bui-tour-mask-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  // The hole as state, not a ref: the portal mounts the layer a render late, and placing the hole must wait for it.
  const [hole, setHole] = React.useState<SVGRectElement | null>(null)

  React.useLayoutEffect(() => {
    if (!hole) return
    const target = getTarget()
    const place = () => {
      const rect = target?.getBoundingClientRect()
      hole.setAttribute("x", String(rect ? rect.left - padding : 0))
      hole.setAttribute("y", String(rect ? rect.top - padding : 0))
      hole.setAttribute("width", String(rect ? rect.width + padding * 2 : 0))
      hole.setAttribute("height", String(rect ? rect.height + padding * 2 : 0))
    }
    place()
    if (!target) return
    let frame = 0
    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(place)
    }
    window.addEventListener("scroll", schedule, { capture: true, passive: true })
    window.addEventListener("resize", schedule)
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule)
    observer?.observe(target)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule, { capture: true })
      window.removeEventListener("resize", schedule)
      observer?.disconnect()
    }
  }, [hole, getTarget, padding])

  // The exit fades out; the layer leaves when the fade ends, or soon after where animations do not run.
  React.useEffect(() => {
    if (open) return
    const timer = window.setTimeout(onExited, 400)
    return () => window.clearTimeout(timer)
  }, [open, onExited])

  return (
    <PortalPrimitive.Root asChild>
      <svg
        data-slot="tour-mask"
        data-state={open ? "open" : "closed"}
        // The modal motion, as Dialog's backdrop: theme.css sets the fade's duration, easing and exit.
        data-bui-motion="modal"
        aria-hidden="true"
        onAnimationEnd={() => {
          if (!open) onExited()
        }}
        className="pointer-events-auto fixed inset-0 z-50 size-full animate-in fade-in-0 data-[state=closed]:pointer-events-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      >
        <defs>
          <mask id={id}>
            <rect width="100%" height="100%" fill="white" />
            <rect ref={setHole} data-slot="tour-spotlight" rx={radius} ry={radius} fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" className="fill-mask" mask={`url(#${id})`} />
      </svg>
    </PortalPrimitive.Root>
  )
}

/** @since 0.1.1 */
function Tour({
  steps,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  onFinish,
  mask = true,
  arrow = true,
  spotlightPadding = 4,
  returnFocusTo,
  className,
}: {
  /** The steps, in order. */
  steps: TourStep[]
  /** Whether the tour is showing, when you control it. Pair it with `onOpenChange`. */
  open?: boolean
  /** Whether it starts showing, when it controls itself. */
  defaultOpen?: boolean
  /** Called with `false` when Escape, Skip or Finish ends the tour. */
  onOpenChange?: (open: boolean) => void
  /** The current step, from 0, when you control it. Pair it with `onStepChange`. */
  step?: number
  /** The step it opens on, when it controls its step. 0 by default; it starts there again each time it opens. */
  defaultStep?: number
  /** Called with the step Next or Back moves to. */
  onStepChange?: (step: number) => void
  /** Called when Finish is pressed on the last step, before the tour closes. */
  onFinish?: () => void
  /** Dims the page and cuts a spotlight round the current target; the page cannot be used while it shows. `true` by default. */
  mask?: boolean
  /** Draws the small arrow from the card to its target. `true` by default. */
  arrow?: boolean
  /** Space in px between the target and the spotlight's edge. 4 by default. */
  spotlightPadding?: number
  /** Where focus goes when the tour ends and the element that had focus before it is gone. */
  returnFocusTo?: ReturnFocusTarget
  /** Classes for the card. */
  className?: string
}) {
  const { strings, dir } = useUiConfig()
  const { locale } = useUiLocale()
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = (openProp ?? openState) && steps.length > 0
  const [stepState, setStepState] = React.useState(defaultStep)
  const [wasOpen, setWasOpen] = React.useState(open)
  const [maskShown, setMaskShown] = React.useState(open)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const titleId = React.useId()
  const descriptionId = React.useId()

  // Each time it opens, an uncontrolled tour starts again from `defaultStep`, and the mask comes back.
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open && stepProp === undefined) setStepState(defaultStep)
  }
  if (open && !maskShown) setMaskShown(true)

  const last = steps.length - 1
  const step = Math.min(Math.max(stepProp ?? stepState, 0), Math.max(last, 0))
  const current = steps[step] as TourStep | undefined

  const target = current?.target
  const getTarget = React.useCallback(() => resolveTarget(target), [target])
  // Whether the step's target is on the page. A target that is missing is treated as none: the card is centred, with
  // no arrow. Read from the page, and read again when the page changes while the tour shows: a ref is set, and a
  // selector matches, only once its element has rendered.
  const watchPage = React.useCallback(
    (onChange: () => void) => {
      if (!open || typeof MutationObserver === "undefined") return () => {}
      const observer = new MutationObserver(onChange)
      observer.observe(document.body, { childList: true, subtree: true })
      return () => observer.disconnect()
    },
    [open]
  )
  const targetFound = React.useSyncExternalStore(watchPage, () => getTarget() !== null, () => false)
  const hasTarget = target !== undefined && targetFound

  // Without a target the card is anchored to a point above the middle of the window by half its own height, so it
  // sits centred. One object for the life of the tour: Popper compares anchors by identity.
  const centre = React.useMemo<Measurable>(
    () => ({
      getBoundingClientRect: () => {
        const x = window.innerWidth / 2
        const y = window.innerHeight / 2 - (contentRef.current?.offsetHeight ?? 0) / 2
        return { x, y, top: y, left: x, right: x, bottom: y, width: 0, height: 0, toJSON: () => ({}) } as DOMRect
      },
    }),
    []
  )
  // Read each time Popper asks, so the anchor is the step's element as it is on the page now.
  const anchor = React.useMemo<React.RefObject<Measurable>>(
    () => ({
      get current(): Measurable {
        return getTarget() ?? centre
      },
    }),
    [getTarget, centre]
  )

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  const goTo = (index: number) => {
    if (index < 0 || index > last) return
    if (stepProp === undefined) setStepState(index)
    onStepChange?.(index)
  }

  const next = () => {
    if (step < last) {
      goTo(step + 1)
      return
    }
    onFinish?.()
    setOpen(false)
  }

  const focusHandlers = useReturnFocus(returnFocusTo, {
    // Focus goes to the card itself, so a screen reader reads its title and description; Tab then reaches the buttons.
    onOpenAutoFocus: (event) => {
      event.preventDefault()
      contentRef.current?.focus({ preventScroll: true })
    },
  })

  // Each step brings its target into view (a jump under reduced motion), and moves focus back to the card so the new
  // step is read.
  const shownStep = React.useRef<number | null>(null)
  React.useEffect(() => {
    if (!open) {
      shownStep.current = null
      return
    }
    const target = getTarget()
    if (target && !inView(target)) {
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      target.scrollIntoView?.({ block: "center", inline: "nearest", behavior: reduced ? "auto" : "smooth" })
    }
    if (shownStep.current !== null && shownStep.current !== step) contentRef.current?.focus({ preventScroll: true })
    shownStep.current = step
  }, [open, step, getTarget])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Arrow keys move between steps from the card or one of its buttons (not from a field in custom content); they
    // follow the reading direction.
    const from = event.target as HTMLElement
    if (from !== event.currentTarget && from.tagName !== "BUTTON") return
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight"
    const backward = dir === "rtl" ? "ArrowRight" : "ArrowLeft"
    if (event.key === forward && step < last) {
      event.preventDefault()
      goTo(step + 1)
    } else if (event.key === backward && step > 0) {
      event.preventDefault()
      goTo(step - 1)
    }
  }

  const format = (value: number) => new Intl.NumberFormat(locale).format(value)
  const handleExited = React.useCallback(() => setMaskShown(false), [])

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={(value) => setOpen(value)} modal={mask}>
      <PopoverPrimitive.Anchor virtualRef={anchor} />
      {mask && maskShown ? (
        <TourMask
          open={open}
          getTarget={getTarget}
          padding={spotlightPadding}
          radius={8}
          onExited={handleExited}
        />
      ) : null}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          data-slot="tour-content"
          data-step={step}
          // The overlay motion, as Popover's: theme.css sets the fade's duration, easing and exit.
          data-bui-motion="overlay"
          side={hasTarget ? (current?.placement ?? "bottom") : "bottom"}
          align={hasTarget ? (current?.align ?? "center") : "center"}
          sideOffset={hasTarget ? spotlightPadding + 6 : 0}
          avoidCollisions={hasTarget}
          collisionPadding={8}
          aria-labelledby={titleId}
          aria-describedby={current?.description ? descriptionId : undefined}
          {...focusHandlers}
          // The tour ends only by Escape, Skip or Finish: a click or focus elsewhere leaves it open.
          onInteractOutside={(event) => event.preventDefault()}
          onKeyDown={handleKeyDown}
          // The Popover look, a little wider: 8px radius, 1px edge, 16px padding, the overlay shadow, 320px wide.
          className={cn(
            "z-50 w-80 max-w-[calc(100vw-2rem)] origin-(--radix-popover-content-transform-origin) rounded-lg border bg-popover p-4 text-popover-foreground shadow-[0_4px_8px_0_rgb(0_0_0/0.05)] outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            className
          )}
        >
          <h2 id={titleId} data-slot="tour-title" className="text-base/normal font-semibold text-heading">
            {current?.title}
          </h2>
          {current?.description ? (
            <div id={descriptionId} data-slot="tour-description" className="mt-1 text-sm/normal text-muted-foreground">
              {current.description}
            </div>
          ) : null}
          {current?.content ? (
            <div data-slot="tour-step-content" className="mt-3 text-sm/normal">
              {current.content}
            </div>
          ) : null}
          <div data-slot="tour-footer" className="mt-4 flex items-center gap-1.5">
            {/* The count's own first letter sets its direction, so "1 of 3" keeps its order on a right-to-left page
                while a right-to-left translation still reads right to left. */}
            <span
              data-slot="tour-step-count"
              className="me-auto text-xs/normal text-muted-foreground tabular-nums [unicode-bidi:plaintext]"
            >
              {fillString(strings.tourStep, { current: format(step + 1), total: format(steps.length) })}
            </span>
            {step < last ? (
              <Button data-slot="tour-skip" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                {strings.skipTour}
              </Button>
            ) : null}
            {step > 0 ? (
              <Button data-slot="tour-back" variant="outline" size="sm" onClick={() => goTo(step - 1)}>
                {strings.back}
              </Button>
            ) : null}
            <Button data-slot="tour-next" size="sm" onClick={next}>
              {step < last ? strings.next : strings.finish}
            </Button>
          </div>
          {arrow && hasTarget ? (
            <PopoverPrimitive.Arrow asChild>
              {/* A 10px square turned 45°, its two outer edges drawn, half of it standing out of the card. */}
              <span
                data-slot="tour-arrow"
                className="block size-2.5 -translate-y-1/2 rotate-45 rounded-br-[2px] border-r border-b bg-popover"
              />
            </PopoverPrimitive.Arrow>
          ) : null}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Tour, type TourStep, type TourTarget }
