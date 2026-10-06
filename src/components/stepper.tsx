"use client"

// Stepper: no primitive. An ordered list of steps, the current one marked `aria-current="step"`, each a button that goes
// to its step, with the current step's content in StepperContent.

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon } from "lucide-react"
import { cn, fillString } from "@/lib/utils"

import { Button } from "@/components/button"
import { useUiConfig, useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

type StepperOrientation = "horizontal" | "vertical"
type StepState = "active" | "completed" | "inactive"

type StepperContextValue = {
  value: number
  goTo: (step: number) => void
  orientation: StepperOrientation
  linear: boolean
  baseId: string
  steps: number[]
  register: (step: number) => () => void
}

type StepperItemContextValue = {
  step: number
  state: StepState
  completed: boolean
  error: boolean
  disabled: boolean
}

const StepperContext = React.createContext<StepperContextValue | null>(null)
const StepperItemContext = React.createContext<StepperItemContextValue | null>(null)

function useStepper(part: string) {
  const context = React.useContext(StepperContext)
  if (!context) throw new Error(`${part} must be used within <Stepper>.`)
  return context
}

function useStepperItem(part: string) {
  const context = React.useContext(StepperItemContext)
  if (!context) throw new Error(`${part} must be used within <StepperItem>.`)
  return context
}

/**
 * The step numbers of the StepperItems written among `children`, read while rendering, so the count ("Step 2 of 3") is
 * right in the server's HTML and the first render. Items drawn by components of your own are counted once they mount.
 */
function collectSteps(children: React.ReactNode, into: Set<number>): Set<number> {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const props = child.props as { step?: unknown; children?: React.ReactNode }
    if (child.type === StepperItem) {
      if (typeof props.step === "number") into.add(props.step)
      return
    }
    if (props.children !== undefined) collectSteps(props.children, into)
  })
  return into
}

/** @since 0.1.0 */
function Stepper({
  className,
  value: valueProp,
  defaultValue = 1,
  onValueChange,
  orientation = "horizontal",
  linear = false,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** The current step's number, when you control it. Pair it with `onValueChange`. */
  value?: number
  /** The step it starts on, when it controls itself. `1` by default. */
  defaultValue?: number
  /** Called with the step's number when a step's button, StepperPrevious or StepperNext changes the step. */
  onValueChange?: (step: number) => void
  /** `horizontal` (default): steps in a row, content below; `vertical`: steps in a column, each step's content under it. */
  orientation?: StepperOrientation
  /** Steps after the current one cannot be chosen from the list: StepperNext (after your checks) moves on. */
  linear?: boolean
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  const [registered, setRegistered] = React.useState<number[]>([])
  const baseId = React.useId()
  // The mounted items once they have registered; until then, the items written in the children.
  const steps = registered.length > 0 ? registered : [...collectSteps(props.children, new Set())].sort((a, b) => a - b)

  const goTo = React.useCallback(
    (step: number) => {
      if (valueProp === undefined) setUncontrolled(step)
      onValueChange?.(step)
    },
    [valueProp, onValueChange]
  )

  const register = React.useCallback((step: number) => {
    setRegistered((current) => (current.includes(step) ? current : [...current, step].sort((a, b) => a - b)))
    return () => setRegistered((current) => current.filter((s) => s !== step))
  }, [])

  const context = React.useMemo(
    () => ({ value, goTo, orientation, linear, baseId, steps, register }),
    [value, goTo, orientation, linear, baseId, steps, register]
  )

  return (
    <StepperContext.Provider value={context}>
      <div
        data-slot="stepper"
        data-orientation={orientation}
        data-linear={linear || undefined}
        className={cn("flex w-full flex-col", className)}
        {...props}
      />
    </StepperContext.Provider>
  )
}

/** @since 0.1.0 */
function StepperList({ className, onKeyDown, ...props }: React.ComponentProps<"ol">) {
  const { orientation } = useStepper("StepperList")
  const { dir } = useUiConfig()

  // Arrow keys move between the step buttons, as between an accordion's triggers; every button stays a tab stop.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLOListElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const target = event.target as HTMLElement
    if (target.getAttribute("data-slot") !== "stepper-trigger") return
    const triggers = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-slot="stepper-trigger"]:not(:disabled)')
    )
    const index = triggers.indexOf(target as HTMLButtonElement)
    if (index === -1) return
    const forward = orientation === "vertical" ? "ArrowDown" : dir === "rtl" ? "ArrowLeft" : "ArrowRight"
    const backward = orientation === "vertical" ? "ArrowUp" : dir === "rtl" ? "ArrowRight" : "ArrowLeft"
    let next: number | null = null
    if (event.key === forward) next = (index + 1) % triggers.length
    else if (event.key === backward) next = (index - 1 + triggers.length) % triggers.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = triggers.length - 1
    if (next === null) return
    event.preventDefault()
    triggers[next].focus()
  }

  return (
    <ol
      data-slot="stepper-list"
      data-orientation={orientation}
      className={cn(
        "m-0 flex list-none p-0",
        orientation === "horizontal" ? "items-center justify-between" : "flex-col",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function StepperItem({
  className,
  step,
  completed: completedProp,
  error = false,
  disabled: disabledProp = false,
  ...props
}: React.ComponentProps<"li"> & {
  /** The step's number, counting from 1. Required. */
  step: number
  /** Marks the step done: a check in its circle. By default every step before the current one is done. */
  completed?: boolean
  /** Marks the step as needing attention: a cross in a red circle, the title in red. */
  error?: boolean
  /** The step's button cannot be used. */
  disabled?: boolean
}) {
  const { value, orientation, linear, register } = useStepper("StepperItem")
  React.useEffect(() => register(step), [register, step])

  const active = step === value
  const completed = completedProp ?? step < value
  const state: StepState = active ? "active" : completed ? "completed" : "inactive"
  const disabled = disabledProp || (linear && step > value)
  const context = React.useMemo(
    () => ({ step, state, completed, error, disabled }),
    [step, state, completed, error, disabled]
  )

  return (
    <StepperItemContext.Provider value={context}>
      <li
        data-slot="stepper-item"
        data-state={state}
        data-error={error || undefined}
        data-disabled={disabled || undefined}
        data-orientation={orientation}
        className={cn(
          "group/stepper-item relative min-w-0",
          orientation === "horizontal"
            ? "flex flex-1 items-center gap-3.5 p-1.5 last:flex-none"
            : "grid grid-cols-[2.5rem_minmax(0,1fr)]",
          className
        )}
        {...props}
      />
    </StepperItemContext.Provider>
  )
}

/** @since 0.1.0 */
function StepperTrigger({
  className,
  children,
  onClick,
  disabled: disabledProp,
  ...props
}: React.ComponentProps<"button">) {
  const { value, goTo, orientation, steps, baseId } = useStepper("StepperTrigger")
  const { step, state, completed, error, disabled: itemDisabled } = useStepperItem("StepperTrigger")
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const format = new Intl.NumberFormat(locale)
  const disabled = disabledProp ?? itemDisabled
  const active = step === value

  return (
    <button
      type="button"
      data-slot="stepper-trigger"
      data-state={state}
      id={`${baseId}-trigger-${step}`}
      aria-current={active ? "step" : undefined}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && !active) goTo(step)
      }}
      className={cn(
        "inline-grid min-w-0 grid-cols-[auto_minmax(0,1fr)] grid-rows-[1fr_auto] items-center rounded-md text-start transition-[color,outline-color] duration-(--bui-duration-control) outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:opacity-60",
        active ? "cursor-default" : "cursor-pointer",
        orientation === "vertical" && "col-span-2 m-1.5 justify-self-start",
        className
      )}
      {...props}
    >
      {/* The number is drawn by the indicator, hidden from assistive technology; the name says it in words. The 8px
          between the indicator and the text is the text's own padding, so a visually hidden title leaves no gap. */}
      <span data-slot="stepper-position" className="sr-only">
        {fillString(strings.stepOf, { current: format.format(step), total: format.format(steps.length) })}
      </span>{" "}
      {children}{" "}
      {error || completed ? (
        <span data-slot="stepper-status" className="sr-only">
          {error ? strings.stepError : strings.stepCompleted}
        </span>
      ) : null}
    </button>
  )
}

/** @since 0.1.0 */
function StepperIndicator({ className, children, ...props }: React.ComponentProps<"span">) {
  const { step, state, error } = useStepperItem("StepperIndicator")
  const { locale } = useUiLocale()

  return (
    <span
      data-slot="stepper-indicator"
      data-state={state}
      data-error={error || undefined}
      aria-hidden="true"
      className={cn(
        // A 32px circle with a 2px edge on the card surface and the visual target's two-layer shadow.
        "relative z-1 row-span-2 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-base/8 font-medium text-muted-foreground shadow-[0_0.5px_0_0_rgba(0,0,0,0.06),0_1px_1px_0_rgba(0,0,0,0.12)] transition-[color,border-color] duration-(--bui-duration-control) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[state=active]:text-primary data-[state=completed]:text-primary",
        "data-error:border-invalid data-error:text-destructive-strong",
        className
      )}
      {...props}
    >
      {children ?? (error ? <XIcon /> : state === "completed" ? <CheckIcon /> : new Intl.NumberFormat(locale).format(step))}
    </span>
  )
}

/** @since 0.1.0 */
function StepperTitle({ className, ...props }: React.ComponentProps<"span">) {
  const { baseId } = useStepper("StepperTitle")
  const { step } = useStepperItem("StepperTitle")

  return (
    <span
      data-slot="stepper-title"
      id={`${baseId}-title-${step}`}
      className={cn(
        "col-start-2 block truncate ps-2 text-sm/normal font-medium text-muted-foreground transition-colors duration-(--bui-duration-control) group-data-[state=active]/stepper-item:text-primary group-data-error/stepper-item:text-destructive-strong",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function StepperDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stepper-description"
      className={cn("col-start-2 block ps-2 text-xs/normal text-muted-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function StepperSeparator({ className, ...props }: React.ComponentProps<"span">) {
  const { orientation } = useStepper("StepperSeparator")

  return (
    <span
      data-slot="stepper-separator"
      data-orientation={orientation}
      aria-hidden="true"
      className={cn(
        "bg-border transition-colors duration-(--bui-duration-control) group-data-[state=completed]/stepper-item:bg-primary",
        orientation === "horizontal"
          ? "h-0.5 min-w-4 flex-1"
          : "col-start-1 row-start-2 ms-5 w-0.5 self-stretch",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function StepperContent({
  className,
  step: stepProp,
  forceMount = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** The step whose content this is. Inside a StepperItem (vertical), that item's step by default. */
  step?: number
  /** Keep the content in the page while its step is not current, hidden. */
  forceMount?: boolean
}) {
  const { value, orientation, baseId } = useStepper("StepperContent")
  const item = React.useContext(StepperItemContext)
  const step = stepProp ?? item?.step
  const active = step === value
  if (!active && !forceMount) return null

  return (
    <div
      role="group"
      data-slot="stepper-content"
      data-state={active ? "active" : "inactive"}
      aria-labelledby={`${baseId}-trigger-${step}`}
      hidden={!active}
      className={cn(
        "bg-card text-sm text-card-foreground",
        orientation === "horizontal" ? "px-1.5 pt-3 pb-4" : "col-start-2 row-start-2 min-w-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * A disabled button cannot keep focus. When StepperPrevious or StepperNext (`button`) disables while it has focus (Back
 * on the first step, or a Next you disable), focus moves to `other`, or to the current step's button, so it never falls
 * to the page.
 */
function useFocusHandOff(button: React.RefObject<HTMLButtonElement | null>, disabled: boolean, other: string) {
  const { value, baseId } = useStepper("StepperPrevious")

  React.useLayoutEffect(() => {
    const node = button.current
    if (!disabled || !node?.disabled || node !== document.activeElement) return
    const root = node.closest('[data-slot="stepper"]')
    const target =
      root?.querySelector<HTMLElement>(`[data-slot="${other}"]:not(:disabled)`) ??
      document.getElementById(`${baseId}-trigger-${value}`)
    target?.focus()
  }, [button, disabled, other, baseId, value])
}

/** @since 0.1.0 */
function StepperPrevious({
  children,
  onClick,
  disabled,
  variant = "secondary",
  ref,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { value, goTo, steps } = useStepper("StepperPrevious")
  const strings = useUiStrings()
  const previous = [...steps].reverse().find((step) => step < value)
  const isDisabled = disabled ?? previous === undefined
  const own = React.useRef<HTMLButtonElement | null>(null)
  const setRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      own.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  useFocusHandOff(own, isDisabled, "stepper-next")

  return (
    <Button
      ref={setRef}
      data-slot="stepper-previous"
      variant={variant}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && previous !== undefined) goTo(previous)
      }}
      {...props}
    >
      {children ?? (
        <>
          <ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
          {strings.back}
        </>
      )}
    </Button>
  )
}

/** @since 0.1.0 */
function StepperNext({ children, onClick, ref, ...props }: React.ComponentProps<typeof Button>) {
  const { value, goTo, steps } = useStepper("StepperNext")
  const strings = useUiStrings()
  const next = steps.find((step) => step > value)
  const last = steps.length > 0 && next === undefined
  const own = React.useRef<HTMLButtonElement | null>(null)
  const setRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      own.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  useFocusHandOff(own, Boolean(props.disabled), "stepper-previous")

  return (
    <Button
      ref={setRef}
      data-slot="stepper-next"
      data-last={last || undefined}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && next !== undefined) goTo(next)
      }}
      {...props}
    >
      {children ??
        (last ? (
          <>
            {strings.finish}
            <CheckIcon aria-hidden="true" />
          </>
        ) : (
          <>
            {strings.next}
            <ArrowRightIcon aria-hidden="true" className="rtl:rotate-180" />
          </>
        ))}
    </Button>
  )
}

export {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperContent,
  StepperPrevious,
  StepperNext,
}
