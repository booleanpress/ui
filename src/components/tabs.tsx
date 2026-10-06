"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"
import { cn, fillString } from "@/lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

import { useUiStrings } from "@booleanpress/ui/provider"

// boolean-ui patch: the selected value, shared with the triggers, so closing a tab can select its neighbour (stock
// leaves the value to Radix alone).
const TabsValueContext = React.createContext<((value: string) => void) | null>(null)

/** @since 0.1.1 */
function Tabs({
  className,
  orientation = "horizontal",
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  // boolean-ui patch: the value is held here and handed to Radix, controlled or not, so a closable trigger can
  // select another tab (stock passes value, defaultValue and onValueChange straight to Radix).
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const controlled = valueProp !== undefined
  const value = controlled ? valueProp : uncontrolled
  const handleValueChange = React.useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange]
  )

  return (
    <TabsValueContext.Provider value={handleValueChange}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        orientation={orientation}
        value={value ?? ""}
        onValueChange={handleValueChange}
        // boolean-ui patch: no gap; the panel's own padding spaces it from the tabs (stock: gap-2).
        className={cn(
          "group/tabs flex data-[orientation=horizontal]:flex-col",
          className
        )}
        {...props}
      />
    </TabsValueContext.Provider>
  )
}

const tabsListVariants = cva(
  // boolean-ui patch: the BooleanPress look — an underlined row of tabs across the full width, no fill and no radius;
  // `default` draws a 1px line under the list (at its end side when vertical), `line` leaves it out (stock: a filled
  // rounded bar, 2.25rem tall, w-fit). `relative` places the sliding `TabsIndicator`.
  "group/tabs-list relative inline-flex items-center text-muted-foreground group-data-[orientation=horizontal]/tabs:w-full group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:items-stretch",
  {
    variants: {
      variant: {
        default:
          "border-border bg-transparent group-data-[orientation=horizontal]/tabs:border-b group-data-[orientation=vertical]/tabs:border-e",
        line: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/** @since 0.1.1 */
function TabsList({
  className,
  variant = "default",
  scrollable = false,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants> & {
    /**
     * Scrolls a row of tabs wider than its box, with a previous and a next button at the ends that show only when
     * there is more to see. Horizontal lists only. @since 0.1.1
     */
    scrollable?: boolean
  }) {
  if (scrollable) {
    return <TabsListScroller className={className} variant={variant} {...props} />
  }

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

// The width of a scroll button (`w-9`), which covers that much of the list's end.
const SCROLL_BUTTON_WIDTH = 36

// boolean-ui patch: the scrolling tab list, an addition. The list scrolls inside a box that holds the variant's line;
// the buttons sit over its ends, outside the tablist, so the tablist holds tabs only. They are pointer controls, out
// of the tab order: the focused tab, and the selected one, are scrolled into view clear of them.
function TabsListScroller({
  className,
  variant = "default",
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  const strings = useUiStrings()
  const listRef = React.useRef<HTMLDivElement>(null)
  const [more, setMore] = React.useState({ backward: false, forward: false })

  // The list's own ref, shared with a ref of the consumer's.
  const setListRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return
    const update = () => {
      // scrollLeft is negative on a right-to-left page; the distance from the start is its size either way.
      const start = Math.abs(list.scrollLeft)
      const end = list.scrollWidth - list.clientWidth
      const backward = start > 1
      const forward = start < end - 1
      setMore((prev) => (prev.backward === backward && prev.forward === forward ? prev : { backward, forward }))
    }
    // Brings a tab wholly into view, clear of the 36px buttons over the ends, when the list overflows.
    const reveal = (tab: Element | null | undefined, behavior: ScrollBehavior) => {
      const overflow = list.scrollWidth - list.clientWidth
      if (!(tab instanceof HTMLElement) || overflow <= 1) return
      const box = list.getBoundingClientRect()
      const rect = tab.getBoundingClientRect()
      const before = rect.left - (box.left + SCROLL_BUTTON_WIDTH)
      const after = rect.right - (box.right - SCROLL_BUTTON_WIDTH)
      const delta = before < 0 ? before : after > 0 ? after : 0
      // scrollLeft runs from 0 to the overflow, or from 0 down to minus the overflow on a right-to-left page.
      const rtl = getComputedStyle(list).direction === "rtl"
      const target = Math.min(Math.max(list.scrollLeft + delta, rtl ? -overflow : 0), rtl ? 0 : overflow)
      if (Math.abs(target - list.scrollLeft) >= 1) list.scrollBy({ left: target - list.scrollLeft, behavior })
    }
    const activeTab = () =>
      Array.from(list.children).find((child) => child.getAttribute("role") === "tab" && child.getAttribute("data-state") === "active")
    // The selected tab shows on load, and whenever the selection changes: from outside, or to a tab just added.
    let revealed = activeTab()
    reveal(revealed, "instant")
    update()
    const onFocus = (event: FocusEvent) => {
      const target = event.target as Element
      if (target.getAttribute("role") === "tab") reveal(target, "smooth")
    }
    list.addEventListener("scroll", update, { passive: true })
    list.addEventListener("focusin", onFocus)
    const resize = new ResizeObserver(update)
    resize.observe(list)
    const mutation = new MutationObserver(() => {
      update()
      const active = activeTab()
      if (active !== revealed) {
        revealed = active
        reveal(active, "smooth")
      }
    })
    mutation.observe(list, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-state"],
    })
    return () => {
      list.removeEventListener("scroll", update)
      list.removeEventListener("focusin", onFocus)
      resize.disconnect()
      mutation.disconnect()
    }
  }, [])

  const scroll = (direction: 1 | -1) => {
    const list = listRef.current
    if (!list) return
    const rtl = getComputedStyle(list).direction === "rtl"
    // A page at a time, less the width of the two buttons, so the tab that was cut off shows whole.
    const page = Math.max(list.clientWidth - 72, list.clientWidth / 2)
    list.scrollBy({ left: direction * (rtl ? -1 : 1) * page })
  }

  const button =
    "absolute inset-y-0 z-20 flex w-9 cursor-pointer items-center justify-center bg-background text-muted-foreground shadow-[0_0_10px_50px_color-mix(in_srgb,var(--color-background)_60%,transparent)] transition-colors duration-(--bui-duration-control) hover:text-foreground [&_svg]:size-3.5 [&_svg]:rtl:rotate-180"

  return (
    <div
      data-slot="tabs-list-scroller"
      data-variant={variant}
      className={cn(
        "relative flex w-full min-w-0 overflow-hidden",
        variant === "default" && "border-b border-border",
        className
      )}
    >
      {more.backward ? (
        <button
          type="button"
          tabIndex={-1}
          data-slot="tabs-scroll-button"
          data-direction="backward"
          aria-label={strings.scrollTabsBackward}
          className={cn(button, "start-0")}
          onClick={() => scroll(-1)}
        >
          <ChevronLeftIcon aria-hidden="true" />
        </button>
      ) : null}
      <TabsPrimitive.List
        ref={setListRef}
        data-slot="tabs-list"
        data-variant={variant}
        data-scrollable=""
        className={cn(
          tabsListVariants({ variant: "line" }),
          "min-w-0 flex-1 scroll-smooth overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
        {...props}
      />
      {more.forward ? (
        <button
          type="button"
          tabIndex={-1}
          data-slot="tabs-scroll-button"
          data-direction="forward"
          aria-label={strings.scrollTabsForward}
          className={cn(button, "end-0")}
          onClick={() => scroll(1)}
        >
          <ChevronRightIcon aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

/** @since 0.1.1 */
function TabsTrigger({
  className,
  value,
  onClose,
  onKeyDown,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /**
   * Makes the tab closable: an × after its label, and Delete or Backspace while it has focus. Remove the tab from
   * your list here; a closed tab that was selected or focused hands both to its neighbour. @since 0.1.1
   */
  onClose?: () => void
}) {
  const strings = useUiStrings()
  const selectValue = React.useContext(TabsValueContext)
  const ref = React.useRef<HTMLButtonElement>(null)
  const [label, setLabel] = React.useState("")

  // The × names the tab it closes, from the tab's own text.
  React.useEffect(() => {
    if (onClose) setLabel(ref.current?.textContent?.trim() ?? "")
  }, [onClose, children])

  const close = () => {
    const trigger = ref.current
    if (!trigger || !onClose) return
    const list = trigger.closest('[role="tablist"]')
    const tabs = list
      ? Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).filter((tab) => tab.closest('[role="tablist"]') === list)
      : []
    const index = tabs.indexOf(trigger)
    const enabled = (tab: HTMLElement) => !tab.hasAttribute("data-disabled")
    const neighbour = tabs.slice(index + 1).find(enabled) ?? tabs.slice(0, index).reverse().find(enabled)
    const selected = trigger.getAttribute("aria-selected") === "true"
    const focused = trigger === document.activeElement
    if (neighbour && selected && neighbour.dataset.value !== undefined) selectValue?.(neighbour.dataset.value)
    if (neighbour && (selected || focused)) neighbour.focus()
    onClose()
  }

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      data-slot="tabs-trigger"
      data-value={value}
      aria-keyshortcuts={onClose ? "Delete" : undefined}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (onClose && !event.defaultPrevented && (event.key === "Delete" || event.key === "Backspace")) {
          event.preventDefault()
          close()
        }
      }}
      // boolean-ui patch: the BooleanPress look — 0.875rem by 1rem padding, 14px semibold labels in the secondary-text
      // token in both themes (stock: text-foreground/60 in light, PATCHES.md §1 row 5), the text colour on hover, and the
      // selected tab in the primary colour over a bar along the list's edge: 1px in `default`, 2px in `line` (stock: a
      // raised bg-background chip with a shadow). The focus outline sits 1px inside the tab. A list with a
      // `TabsIndicator` hides the per-tab bars, and the indicator slides instead.
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center gap-2 border-0 bg-transparent px-4 py-3.5 text-sm/normal font-semibold whitespace-nowrap text-muted-foreground transition-[color,outline-color] duration-(--bui-duration-control) outline-none group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:z-10 focus-visible:outline-solid focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60 data-[state=active]:text-primary data-[state=active]:hover:text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "after:absolute after:bg-primary after:opacity-0 after:transition-opacity after:duration-(--bui-duration-control) data-[state=active]:after:opacity-100",
        "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-0 group-data-[orientation=horizontal]/tabs:after:h-px group-data-[variant=line]/tabs-list:group-data-[orientation=horizontal]/tabs:after:h-0.5",
        "group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:end-0 group-data-[orientation=vertical]/tabs:after:w-px group-data-[variant=line]/tabs-list:group-data-[orientation=vertical]/tabs:after:w-0.5",
        "[[data-slot=tabs-list]:has(>[data-slot=tabs-indicator])_&]:after:hidden",
        onClose && "pe-2.5",
        className
      )}
      {...props}
    >
      {children}
      {onClose ? (
        // A button cannot sit inside a tab, so the × is a pointer target hidden from assistive technology; the
        // keyboard closes the tab with Delete, announced by aria-keyshortcuts. It keeps the press from selecting
        // the tab first.
        <span
          aria-hidden="true"
          data-slot="tabs-trigger-close"
          title={fillString(strings.closeTab, { label })}
          className="-my-1 inline-flex size-5 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-(--bui-duration-control) hover:bg-accent hover:text-foreground [&_svg]:size-3!"
          onMouseDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            close()
          }}
        >
          <XIcon />
        </span>
      ) : null}
    </TabsPrimitive.Trigger>
  )
}

/**
 * A bar that slides to the selected tab, in place of each tab's own bar. Put it last inside `TabsList`. It moves with
 * `transform` only, so it never makes the page lay out again.
 *
 * @since 0.1.1
 */
function TabsIndicator({ className, style, ...props }: React.ComponentProps<"span">) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [box, setBox] = React.useState<{ vertical: boolean; offset: number; length: number } | null>(null)
  const [ready, setReady] = React.useState(false)

  React.useLayoutEffect(() => {
    const indicator = ref.current
    const list = indicator?.parentElement
    if (!indicator || !list) return
    const observed = new Set<Element>()
    const measure = () => {
      const tabs = Array.from(list.children).filter((child) => child.getAttribute("role") === "tab") as HTMLElement[]
      for (const tab of tabs) {
        if (!observed.has(tab)) {
          observed.add(tab)
          resize.observe(tab)
        }
      }
      const active = tabs.find((tab) => tab.getAttribute("data-state") === "active")
      const vertical = list.getAttribute("aria-orientation") === "vertical"
      const next = active
        ? vertical
          ? { vertical, offset: active.offsetTop, length: active.offsetHeight }
          : { vertical, offset: active.offsetLeft, length: active.offsetWidth }
        : null
      setBox((prev) =>
        prev && next && prev.vertical === next.vertical && prev.offset === next.offset && prev.length === next.length
          ? prev
          : next
      )
    }
    const resize = new ResizeObserver(measure)
    resize.observe(list)
    const mutation = new MutationObserver(measure)
    mutation.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-state"] })
    measure()
    // Slide only after the first position is drawn, so the bar does not sweep in from the start on load.
    const frame = requestAnimationFrame(() => setReady(true))
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      mutation.disconnect()
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="tabs-indicator"
      data-ready={ready ? "" : undefined}
      // `left` and `origin-left` are physical on purpose: offsetLeft is measured from the left in both directions.
      className={cn(
        "pointer-events-none absolute z-10 bg-primary data-ready:transition-transform data-ready:duration-(--bui-duration-slow) data-ready:ease-(--bui-ease-standard)",
        "group-data-[orientation=horizontal]/tabs:bottom-0 group-data-[orientation=horizontal]/tabs:left-0 group-data-[orientation=horizontal]/tabs:h-px group-data-[orientation=horizontal]/tabs:w-px group-data-[orientation=horizontal]/tabs:origin-left group-data-[variant=line]/tabs-list:group-data-[orientation=horizontal]/tabs:h-0.5",
        "group-data-[orientation=vertical]/tabs:end-0 group-data-[orientation=vertical]/tabs:top-0 group-data-[orientation=vertical]/tabs:h-px group-data-[orientation=vertical]/tabs:w-px group-data-[orientation=vertical]/tabs:origin-top group-data-[variant=line]/tabs-list:group-data-[orientation=vertical]/tabs:w-0.5",
        className
      )}
      style={{
        opacity: box ? undefined : 0,
        transform: box
          ? box.vertical
            ? `translateY(${box.offset}px) scaleY(${box.length})`
            : `translateX(${box.offset}px) scaleX(${box.length})`
          : undefined,
        ...style,
      }}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      // boolean-ui patch: the panel is padded 0.75rem 1rem 1rem, so its text lines up with the tab labels, and shows the
      // 1px focus outline when it takes focus (stock: no padding, outline-none).
      className={cn(
        "flex-1 px-4 pt-3 pb-4 outline-none group-data-[orientation=vertical]/tabs:py-3.5 focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsIndicator, TabsContent, tabsListVariants }
