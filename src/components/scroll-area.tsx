"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { useScrollFocus } from "@/lib/scroll-focus"

const FADE_EDGES = ["data-fade-top", "data-fade-bottom", "data-fade-start", "data-fade-end"] as const

/**
 * Marks the edges of a scrolling viewport behind which content is hidden, `data-fade-top`, `-bottom`, `-start` and
 * `-end`, as it scrolls and as its content or size changes. Set on the element directly, so scrolling never re-renders.
 */
function useScrollFade(node: HTMLElement | null, enabled: boolean) {
  React.useEffect(() => {
    if (!node || !enabled) return
    const update = () => {
      // In a right-to-left page scrollLeft runs from 0 at the start to negative values toward the end.
      const x = Math.abs(node.scrollLeft)
      node.toggleAttribute("data-fade-top", node.scrollTop > 1)
      node.toggleAttribute("data-fade-bottom", node.scrollTop < node.scrollHeight - node.clientHeight - 1)
      node.toggleAttribute("data-fade-start", x > 1)
      node.toggleAttribute("data-fade-end", x < node.scrollWidth - node.clientWidth - 1)
    }
    update()
    node.addEventListener("scroll", update, { passive: true })
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update)
    resize?.observe(node)
    if (node.firstElementChild) resize?.observe(node.firstElementChild)
    return () => {
      node.removeEventListener("scroll", update)
      resize?.disconnect()
      for (const edge of FADE_EDGES) node.removeAttribute(edge)
    }
  }, [node, enabled])
}

/** @since 0.1.0 */
function ScrollArea({
  className,
  children,
  fade = false,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /**
   * Fade the content out over 40 px at each edge behind which more of it is hidden; the fade follows the scroll.
   * @since 0.1.0
   */
  fade?: boolean
}) {
  const { attach, tabIndex } = useScrollFocus<HTMLDivElement>()
  const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null)
  const viewportRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      attach(node)
      setViewport(node)
    },
    [attach]
  )
  useScrollFade(viewport, fade)

  // boolean-ui patch: a ScrollBar given among the children is drawn beside the viewport, where Radix places its bars,
  // not inside the scrolled content, so the fade does not mask it (stock: it stayed inside the viewport).
  const bars: React.ReactNode[] = []
  const content: React.ReactNode[] = []
  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement(child) && child.type === ScrollBar) bars.push(child)
    else content.push(child)
  }

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      // boolean-ui patch: the BooleanPress look — a focused viewport outlines the whole area, 1px and 2px away, as
      // every focused control is (stock: a 3px ring on the viewport, clipped by the area).
      className={cn(
        "relative has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-solid has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-1 has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-offset-2 has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-ring",
        className
      )}
      {...props}
    >
      {/* boolean-ui patch: the viewport takes keyboard focus while it scrolls content with nothing focusable in it, so
          the arrow keys can scroll it (stock styles its focus ring but never makes it focusable). */}
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        tabIndex={tabIndex}
        data-slot="scroll-area-viewport"
        data-fade={fade ? "" : undefined}
        className={cn(
          "size-full rounded-[inherit] outline-none",
          // boolean-ui patch: `fade` masks 40 px at each edge that hides content, intersecting a vertical and an
          // inline gradient; the inline one turns around in a right-to-left page (stock: no fade).
          fade &&
            "[--bui-fade-bottom:0px] [--bui-fade-end:0px] [--bui-fade-start:0px] [--bui-fade-top:0px] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_var(--bui-fade-top),black_calc(100%-var(--bui-fade-bottom)),transparent),linear-gradient(to_right,transparent,black_var(--bui-fade-start),black_calc(100%-var(--bui-fade-end)),transparent)] data-fade-bottom:[--bui-fade-bottom:2.5rem] data-fade-end:[--bui-fade-end:2.5rem] data-fade-start:[--bui-fade-start:2.5rem] data-fade-top:[--bui-fade-top:2.5rem] rtl:[mask-image:linear-gradient(to_bottom,transparent,black_var(--bui-fade-top),black_calc(100%-var(--bui-fade-bottom)),transparent),linear-gradient(to_left,transparent,black_var(--bui-fade-start),black_calc(100%-var(--bui-fade-end)),transparent)]"
        )}
      >
        {content}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      {bars}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

/** @since 0.1.0 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      // boolean-ui patch: the BooleanPress look — a 4px bar inset 4px from the edges (stock: a 10px bar with a 1px
      // inset and a transparent edge).
      className={cn(
        "flex touch-none p-1 select-none",
        orientation === "vertical" && "h-full w-3",
        orientation === "horizontal" && "h-3 flex-col",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        // boolean-ui patch: the BooleanPress look — the edge colour, 6px radius (stock: rounded-full).
        className="relative flex-1 rounded-md bg-border"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
