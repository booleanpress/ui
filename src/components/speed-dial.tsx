"use client"

// SpeedDial: no primitive. A floating action button that opens its actions in a line or on a circle — the menu button
// pattern: the actions are menu items, reached with the arrow keys, and Escape closes them.

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip"
import { useUiStrings } from "@booleanpress/ui/provider"

type SpeedDialType = "linear" | "circle" | "semi-circle" | "quarter-circle"
type SpeedDialDirection = "up" | "down" | "left" | "right" | "up-left" | "up-right" | "down-left" | "down-right"
type TooltipSide = "top" | "right" | "bottom" | "left"
type FocusTarget = "first" | "last" | null

type SpeedDialContextValue = {
  open: boolean
  setOpen: (open: boolean, focus?: FocusTarget) => void
  type: SpeedDialType
  direction: SpeedDialDirection
  radius: number
  transitionDelay: number
  tooltipSide: TooltipSide
  triggerId: string
  listId: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
  pendingFocusRef: React.RefObject<FocusTarget>
}

const SpeedDialContext = React.createContext<SpeedDialContextValue | null>(null)

function useSpeedDial(part: string) {
  const context = React.useContext(SpeedDialContext)
  if (!context) throw new Error(`${part} must be used within <SpeedDial>.`)
  return context
}

// The flex direction of a line of actions: the trigger first, the actions running away from it. Left and right are
// physical: a row runs from the right in a right-to-left page, so there the row is reversed.
const LINE: Record<string, string> = {
  up: "flex-col-reverse",
  down: "flex-col",
  left: "flex-row-reverse rtl:flex-row",
  right: "flex-row rtl:flex-row-reverse",
}

// Offset in px of action `index` of `count` from the trigger's centre, for the round layouts (y grows downwards).
function offsetOf(type: SpeedDialType, direction: SpeedDialDirection, index: number, count: number, radius: number) {
  if (type === "circle") {
    const angle = ((2 * Math.PI) / count) * index
    return [radius * Math.cos(angle), radius * Math.sin(angle)]
  }
  const span = type === "semi-circle" ? Math.PI : Math.PI / 2
  const angle = count > 1 ? (span / (count - 1)) * index : 0
  const x = radius * Math.cos(angle)
  const y = radius * Math.sin(angle)
  if (type === "semi-circle") {
    if (direction === "down") return [x, y]
    if (direction === "left") return [-y, x]
    if (direction === "right") return [y, x]
    return [x, -y]
  }
  if (direction === "up-right") return [x, -y]
  if (direction === "down-left") return [-y, x]
  if (direction === "down-right") return [y, x]
  return [-x, -y]
}

const DEFAULT_DIRECTION: Record<SpeedDialType, SpeedDialDirection> = {
  linear: "up",
  circle: "up",
  "semi-circle": "up",
  "quarter-circle": "up-left",
}

/** @since 0.1.1 */
function SpeedDial({
  className,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  type = "linear",
  direction: directionProp,
  radius: radiusProp,
  transitionDelay = 30,
  tooltipSide: tooltipSideProp,
  mask = false,
  maskClassName,
  children,
  onBlur,
  ...props
}: React.ComponentProps<"div"> & {
  /** Whether the actions show, when you control it. Pair it with `onOpenChange`. */
  open?: boolean
  /** Whether the actions show at the start, when the speed dial controls itself. */
  defaultOpen?: boolean
  /** Called with the new state when the actions open or close. */
  onOpenChange?: (open: boolean) => void
  /** `linear` (default) lines the actions up; `circle`, `semi-circle` and `quarter-circle` set them on an arc. */
  type?: SpeedDialType
  /**
   * Where the actions go from the trigger. A line or a semicircle: `up` (default), `down`, `left`, `right`; a quarter
   * circle: `up-left` (default), `up-right`, `down-left`, `down-right`. A circle ignores it. Physical, as the page sees it.
   */
  direction?: SpeedDialDirection
  /** The arc's radius in px, centre to centre: 80 by default, 120 for a quarter circle. */
  radius?: number
  /** Milliseconds between one action's entrance and the next. 30 by default; 0 opens them together. */
  transitionDelay?: number
  /** The side of each action its tooltip opens on. By default beside a vertical line, above anything else. */
  tooltipSide?: TooltipSide
  /** Dims the positioned container behind the open actions; a click on it closes them. */
  mask?: boolean
  /** Classes for the mask. */
  maskClassName?: string
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolled
  const direction = directionProp ?? DEFAULT_DIRECTION[type]
  const radius = radiusProp ?? (type === "quarter-circle" ? 120 : 80)
  const vertical = type === "linear" && (direction === "up" || direction === "down")
  const tooltipSide = tooltipSideProp ?? (vertical ? "left" : "top")
  const rootRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const pendingFocusRef = React.useRef<FocusTarget>(null)
  const baseId = React.useId()

  const setOpen = React.useCallback(
    (next: boolean, focus: FocusTarget = null) => {
      pendingFocusRef.current = next ? focus : null
      if (openProp === undefined) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  // A press anywhere outside closes the actions.
  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open, setOpen])

  const context = React.useMemo(
    () => ({
      open,
      setOpen,
      type,
      direction,
      radius,
      transitionDelay,
      tooltipSide,
      triggerId: `${baseId}-trigger`,
      listId: `${baseId}-list`,
      triggerRef,
      pendingFocusRef,
    }),
    [open, setOpen, type, direction, radius, transitionDelay, tooltipSide, baseId]
  )

  return (
    <SpeedDialContext.Provider value={context}>
      {mask ? (
        <div
          data-slot="speed-dial-mask"
          data-state={open ? "open" : "closed"}
          aria-hidden="true"
          // A press on the mask is a press outside the speed dial: the listener above closes the actions.
          className={cn(
            "absolute inset-0 rounded-md bg-mask transition-opacity duration-(--bui-duration-base) ease-(--bui-ease-standard) data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0",
            maskClassName
          )}
        />
      ) : null}
      <div
        ref={rootRef}
        data-slot="speed-dial"
        data-state={open ? "open" : "closed"}
        data-type={type}
        data-direction={type === "circle" ? undefined : direction}
        className={cn(
          "group/speed-dial relative flex w-fit items-center gap-2",
          type === "linear" ? LINE[direction] ?? LINE.up : "justify-center",
          className
        )}
        onBlur={(event) => {
          onBlur?.(event)
          // Tab out of the actions closes them, as a menu does.
          const next = event.relatedTarget as Node | null
          if (open && next && !event.currentTarget.contains(next)) setOpen(false)
        }}
        {...props}
      >
        {children}
      </div>
    </SpeedDialContext.Provider>
  )
}

/** @since 0.1.1 */
function SpeedDialTrigger({
  className,
  children,
  onClick,
  onKeyDown,
  onKeyUp,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, setOpen, triggerId, listId, triggerRef } = useSpeedDial("SpeedDialTrigger")
  const strings = useUiStrings()

  return (
    <Button
      ref={triggerRef}
      id={triggerId}
      data-slot="speed-dial-trigger"
      data-state={open ? "open" : "closed"}
      size="icon"
      rounded
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={listId}
      aria-label={ariaLabel ?? strings.speedDialActions}
      className={cn("z-1", className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setOpen(!open)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key === "Escape" && open) {
          event.preventDefault()
          setOpen(false)
          return
        }
        if (event.defaultPrevented) return
        // The keyboard opens the actions with focus on the first one; the pointer leaves focus on the trigger.
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          setOpen(!open, "first")
        } else if (event.key.startsWith("Arrow")) {
          event.preventDefault()
          const backwards = event.key === "ArrowUp" || event.key === "ArrowLeft"
          if (!open) setOpen(true, "first")
          else focusAction(listId, backwards ? "last" : "first")
        }
      }}
      onKeyUp={(event) => {
        onKeyUp?.(event)
        // Space activates a button on release: the toggle already happened on the press.
        if (event.key === " ") event.preventDefault()
      }}
      {...props}
    >
      {children ?? (
        <PlusIcon
          aria-hidden="true"
          className="transition-transform duration-(--bui-duration-slow) ease-(--bui-ease-standard) group-data-[state=open]/speed-dial:rotate-45"
        />
      )}
    </Button>
  )
}

function focusAction(listId: string, which: "first" | "last") {
  const items = Array.from(
    document.getElementById(listId)?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []
  )
  items[which === "first" ? 0 : items.length - 1]?.focus()
}

/** @since 0.1.1 */
function SpeedDialContent({ className, children, onKeyDown, ...props }: React.ComponentProps<"ul">) {
  const { open, setOpen, type, direction, radius, transitionDelay, triggerId, listId, triggerRef, pendingFocusRef } =
    useSpeedDial("SpeedDialContent")
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const count = items.length

  // Focus the first or last action once the keyboard has opened the list.
  React.useEffect(() => {
    if (!open || !pendingFocusRef.current) return
    focusAction(listId, pendingFocusRef.current)
    pendingFocusRef.current = null
  }, [open, listId, pendingFocusRef])

  // The arrow pointing along the line moves outwards; on an arc, ↓ and → move on and ↑ and ← back.
  const forward =
    type === "linear"
      ? { up: ["ArrowUp"], down: ["ArrowDown"], left: ["ArrowLeft"], right: ["ArrowRight"] }[direction as string] ?? ["ArrowUp"]
      : ["ArrowDown", "ArrowRight"]
  const backward =
    type === "linear"
      ? { up: ["ArrowDown"], down: ["ArrowUp"], left: ["ArrowRight"], right: ["ArrowLeft"] }[direction as string] ?? ["ArrowDown"]
      : ["ArrowUp", "ArrowLeft"]

  return (
    <ul
      id={listId}
      role="menu"
      aria-labelledby={triggerId}
      aria-orientation={type === "linear" ? (direction === "left" || direction === "right" ? "horizontal" : "vertical") : undefined}
      data-slot="speed-dial-content"
      data-state={open ? "open" : "closed"}
      // Closed, the actions are out of the page's focus order and accessibility tree, though still drawn for the exit.
      inert={!open}
      className={cn(
        "m-0 list-none p-0",
        type === "linear" ? cn("flex items-center gap-2", LINE[direction] ?? LINE.up) : "pointer-events-none absolute inset-0",
        !open && "pointer-events-none",
        className
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        // An open tooltip claims Escape first (and marks it handled); the same press still closes the actions.
        if (event.key === "Escape") {
          event.preventDefault()
          setOpen(false)
          triggerRef.current?.focus()
          return
        }
        if (event.defaultPrevented) return
        const actions = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)'))
        const index = actions.indexOf(document.activeElement as HTMLElement)
        if (index === -1) return
        let next: number | null = null
        if (forward.includes(event.key)) next = (index + 1) % actions.length
        else if (backward.includes(event.key)) next = (index - 1 + actions.length) % actions.length
        else if (event.key === "Home") next = 0
        else if (event.key === "End") next = actions.length - 1
        if (next === null) return
        event.preventDefault()
        actions[next].focus()
      }}
      {...props}
    >
      {items.map((child, index) => {
        const round = type !== "linear"
        // Rounded to hundredths: the trigonometry leaves values such as 7e-15, which CSS cannot parse.
        const [x, y] = (round ? offsetOf(type, direction, index, count, radius) : [0, 0]).map((v) => Math.round(v * 100) / 100 || 0)
        // Opening, the action nearest the trigger enters first; closing, it leaves last.
        const delay = (open ? index : count - 1 - index) * transitionDelay
        return (
          <li
            key={child.key ?? index}
            role="none"
            data-slot="speed-dial-item"
            style={
              {
                "--speed-dial-delay": `${delay}ms`,
                ...(round ? { "--speed-dial-x": `calc(-50% + ${x}px)`, "--speed-dial-y": `calc(-50% + ${y}px)` } : {}),
              } as React.CSSProperties
            }
            className={cn(
              // Transform and opacity only: each action grows from nothing in its place.
              "flex transition-[scale,opacity] delay-(--speed-dial-delay) duration-(--bui-duration-slow) ease-(--bui-ease-standard) motion-reduce:delay-0",
              open ? "pointer-events-auto scale-100 opacity-100" : "scale-0 opacity-0",
              round && "absolute top-1/2 left-1/2 translate-x-(--speed-dial-x) translate-y-(--speed-dial-y)"
            )}
          >
            {child}
          </li>
        )
      })}
    </ul>
  )
}

/** @since 0.1.1 */
function SpeedDialAction({
  className,
  label,
  tooltip = true,
  onClick,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button> & {
  /** The action's name: its accessible name and its tooltip. Required, as the action shows an icon only. */
  label: string
  /** Shows the label in a tooltip on hover and focus. `true` by default. */
  tooltip?: boolean
}) {
  const { setOpen, tooltipSide, triggerRef } = useSpeedDial("SpeedDialAction")

  const action = (
    <Button
      role="menuitem"
      tabIndex={-1}
      data-slot="speed-dial-action"
      aria-label={label}
      variant={variant}
      size={size}
      rounded
      className={className}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        // A chosen action closes the menu and returns focus to the trigger.
        setOpen(false)
        triggerRef.current?.focus()
      }}
      {...props}
    />
  )

  if (!tooltip) return action
  return (
    <Tooltip>
      <TooltipTrigger asChild>{action}</TooltipTrigger>
      <TooltipContent side={tooltipSide} sideOffset={4}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export { SpeedDial, SpeedDialTrigger, SpeedDialContent, SpeedDialAction }
