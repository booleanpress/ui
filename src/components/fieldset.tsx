"use client"

// Fieldset: a native <fieldset> and <legend> in a bordered box; `toggleable` turns the legend into a disclosure button on
// Radix Collapsible.

import * as React from "react"
import { flushSync } from "react-dom"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { usePresence } from "@/lib/presence"
import { cn } from "@/lib/utils"

const FieldsetContext = React.createContext({ toggleable: false, open: true })

/** @since 0.1.1 */
function Fieldset({
  className,
  toggleable = false,
  open,
  defaultOpen = true,
  onOpenChange,
  children,
  ref,
  ...props
}: React.ComponentProps<"fieldset"> & {
  /** Turns the legend into a button that shows and hides the content. `false` by default. */
  toggleable?: boolean
  /** Whether the content shows, when you control it. Pair it with `onOpenChange`. Needs `toggleable`. */
  open?: boolean
  /** Whether the content shows at the start, when the fieldset controls itself. `true` by default. */
  defaultOpen?: boolean
  /** Called with the new state when the content is shown or hidden. */
  onOpenChange?: (open: boolean) => void
}) {
  // The open state is held here, controlled or not, so the content knows when to hide itself.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isOpen = open ?? uncontrolledOpen
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [open, onOpenChange]
  )
  const context = React.useMemo(() => ({ toggleable, open: isOpen }), [toggleable, isOpen])
  const classes = cn("m-0 min-w-0 rounded-md border bg-card px-4 pb-4 text-card-foreground", className)

  const own = React.useRef<HTMLFieldSetElement | null>(null)
  const setRef = React.useCallback(
    (node: HTMLFieldSetElement | null) => {
      own.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  // A folded field that the form finds invalid on submit opens its section first, so the browser can move to it and
  // show its message (`invalid` does not bubble: it is caught on its way down).
  React.useEffect(() => {
    const node = own.current
    if (!toggleable || isOpen || !node) return
    const onInvalid = () => flushSync(() => handleOpenChange(true))
    node.addEventListener("invalid", onInvalid, true)
    return () => node.removeEventListener("invalid", onInvalid, true)
  }, [toggleable, isOpen, handleOpenChange])

  return (
    <FieldsetContext.Provider value={context}>
      {toggleable ? (
        <CollapsiblePrimitive.Root asChild open={isOpen} onOpenChange={handleOpenChange}>
          <fieldset ref={setRef} data-slot="fieldset" data-toggleable="" className={classes} {...props}>
            {children}
          </fieldset>
        </CollapsiblePrimitive.Root>
      ) : (
        <fieldset ref={setRef} data-slot="fieldset" className={classes} {...props}>
          {children}
        </fieldset>
      )}
    </FieldsetContext.Provider>
  )
}

/** @since 0.1.1 */
function FieldsetLegend({
  className,
  indicator,
  children,
  ...props
}: React.ComponentProps<"legend"> & {
  /**
   * Replaces the minus (open) and plus (closed) of a toggleable legend. The button is the Tailwind group
   * `fieldset-trigger`, so an icon can follow the state with `group-data-[state=open]/fieldset-trigger:`.
   */
  indicator?: React.ReactNode
}) {
  const { toggleable } = React.useContext(FieldsetContext)
  const look = "rounded-md bg-card font-semibold text-card-foreground"

  if (!toggleable) {
    return (
      <legend
        data-slot="fieldset-legend"
        // A 24px line, as the visual target's legend, whose label sits in a 16px line box: 38px tall.
        className={cn(look, "border border-transparent px-2.5 py-1.5 text-sm/6", className)}
        {...props}
      >
        {children}
      </legend>
    )
  }

  return (
    <legend data-slot="fieldset-legend" className={cn(look, "p-0 text-sm/normal", className)} {...props}>
      <CollapsiblePrimitive.Trigger
        data-slot="fieldset-trigger"
        // The whole legend is the button: its padding is the button's, so the target is the legend's 35px box.
        className="group/fieldset-trigger flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2.5 py-1.5 text-start transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <span
          data-slot="fieldset-indicator"
          aria-hidden="true"
          className="flex shrink-0 items-center text-muted-foreground transition-colors duration-(--bui-duration-control) group-hover/fieldset-trigger:text-secondary-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5"
        >
          {indicator === undefined ? (
            <>
              <MinusIcon className="group-data-[state=closed]/fieldset-trigger:hidden" />
              <PlusIcon className="group-data-[state=open]/fieldset-trigger:hidden" />
            </>
          ) : (
            indicator
          )}
        </span>
        {children}
      </CollapsiblePrimitive.Trigger>
    </legend>
  )
}

/** @since 0.1.1 */
function FieldsetContent({
  className,
  children,
  // Accepted for Radix's API; the content of a toggleable fieldset always stays in the page.
  forceMount: _forceMount,
  ref,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  const { toggleable, open } = React.useContext(FieldsetContext)
  const own = React.useRef<HTMLDivElement | null>(null)
  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      own.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  // Folded content stays in the page, so its fields keep what was typed and are still submitted with the form. Radix
  // shows force-mounted content at all times, so it is hidden here once the closing slide has ended.
  const { mounted } = usePresence(open, own)

  if (!toggleable) {
    return (
      <div data-slot="fieldset-content" className={cn("text-sm", className)} ref={ref} {...props}>
        {children}
      </div>
    )
  }

  return (
    <CollapsiblePrimitive.Content
      ref={setRef}
      data-slot="fieldset-content"
      forceMount
      hidden={!mounted}
      // The height animates from Radix's measured `--radix-collapsible-content-height`, as the accordion's does, and
      // holds at 0 from the slide's end until the content is hidden. A 4px gutter inside the clip (-m-1 p-1) keeps the
      // focus outlines of the controls at its edges in view.
      className="-m-1 overflow-hidden p-1 text-sm data-[state=closed]:animate-collapsible-up data-[state=closed]:fill-mode-forwards data-[state=open]:animate-collapsible-down"
      {...props}
    >
      <div data-slot="fieldset-content-inner" className={className}>
        {children}
      </div>
    </CollapsiblePrimitive.Content>
  )
}

export { Fieldset, FieldsetLegend, FieldsetContent }
