"use client"

// Panel: a bordered container with a header, content and footer; `toggleable` folds the content away on Radix Collapsible.

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Collapsible as CollapsiblePrimitive, Slot } from "radix-ui"
import { usePresence } from "@/lib/presence"
import { cn } from "@/lib/utils"

import { useUiStrings } from "@booleanpress/ui/provider"

type PanelContextValue = {
  toggleable: boolean
  /** Whether the content shows. */
  open: boolean
  /** The id PanelTitle carries, so the toggle's name can point at it from the first render, on the server too. */
  titleId: string
  setTitleId: (id: string | undefined) => void
}

const PanelContext = React.createContext<PanelContextValue>({
  toggleable: false,
  open: true,
  titleId: "",
  setTitleId: () => {},
})

// Whether a part sits inside PanelContent, so a footer placed there drops its own side and bottom padding.
const PanelContentContext = React.createContext(false)

/** @since 0.1.0 */
function Panel({
  className,
  toggleable = false,
  open,
  defaultOpen = true,
  onOpenChange,
  disabled,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Adds a PanelTrigger's toggle: the content folds away and back. `false` by default. */
  toggleable?: boolean
  /** Whether the content shows, when you control it. Pair it with `onOpenChange`. Needs `toggleable`. */
  open?: boolean
  /** Whether the content shows at the start, when the panel controls itself. `true` by default. */
  defaultOpen?: boolean
  /** Called with the new state when the content is shown or hidden. */
  onOpenChange?: (open: boolean) => void
  /** Stops the toggle from working; the content keeps its state. */
  disabled?: boolean
}) {
  const generatedTitleId = React.useId()
  const [ownTitleId, setTitleId] = React.useState<string | undefined>(undefined)
  const titleId = ownTitleId ?? generatedTitleId
  // The open state is held here, controlled or not, so a force-mounted content knows when to hide itself.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isOpen = open ?? uncontrolledOpen
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [open, onOpenChange]
  )
  const context = React.useMemo(
    () => ({ toggleable, open: isOpen, titleId, setTitleId }),
    [toggleable, isOpen, titleId]
  )
  const classes = cn("flex flex-col rounded-md border bg-card text-card-foreground", className)

  return (
    <PanelContext.Provider value={context}>
      {toggleable ? (
        <CollapsiblePrimitive.Root
          data-slot="panel"
          data-toggleable=""
          open={isOpen}
          onOpenChange={handleOpenChange}
          disabled={disabled}
          className={classes}
          {...props}
        >
          {children}
        </CollapsiblePrimitive.Root>
      ) : (
        <div data-slot="panel" className={classes} {...props}>
          {children}
        </div>
      )}
    </PanelContext.Provider>
  )
}

/** @since 0.1.0 */
function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn("flex items-center justify-between gap-2 p-4", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function PanelTitle({
  className,
  asChild = false,
  id,
  ...props
}: React.ComponentProps<"div"> & {
  /** Render the child element instead (an `h2`, an `h3`), with the title's classes merged onto it. */
  asChild?: boolean
}) {
  const { titleId, setTitleId } = React.useContext(PanelContext)
  const Comp = asChild ? Slot.Root : "div"

  // The toggle's name points at the title by id: the panel's own, or the one given here.
  React.useEffect(() => {
    if (id === undefined) return
    setTitleId(id)
    return () => setTitleId(undefined)
  }, [id, setTitleId])

  return (
    <Comp
      id={id ?? titleId}
      data-slot="panel-title"
      className={cn("text-sm/normal font-semibold", className)}
      {...props}
    />
  )
}

/** The `toggleContent` string split round its `{title}`: the words before and after the title. */
function splitAroundTitle(template: string): [string, string] {
  const at = template.indexOf("{title}")
  if (at < 0) return [template.trim(), ""]
  return [template.slice(0, at).trim(), template.slice(at + "{title}".length).trim()]
}

/** @since 0.1.0 */
function PanelActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-actions"
      className={cn("ms-auto flex items-center gap-1", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function PanelTrigger({
  className,
  indicator,
  children,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger> & {
  /** Replaces the chevron, which turns when the content opens. The trigger is the Tailwind group `panel-trigger`. */
  indicator?: React.ReactNode
}) {
  const { toggleable, titleId } = React.useContext(PanelContext)
  const strings = useUiStrings()
  const wordsId = React.useId()
  if (!toggleable) return null

  // The name is the `toggleContent` string with the title in its place ("Show or hide SMTP connection"): the words round
  // `{title}` in hidden spans, and the title itself, joined by `aria-labelledby`. It is right from the first render.
  const [before, after] = splitAroundTitle(strings.toggleContent)
  const labelledBy =
    ariaLabel === undefined
      ? [before && `${wordsId}-before`, titleId, after && `${wordsId}-after`].filter(Boolean).join(" ")
      : undefined

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="panel-trigger"
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      // A 24px round target round the 14px icon, pulled into the header's padding so the header keeps its 53px.
      className={cn(
        "group/panel-trigger -my-1 -me-1.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {labelledBy && before ? (
        <span id={`${wordsId}-before`} hidden>
          {before}
        </span>
      ) : null}
      {labelledBy && after ? (
        <span id={`${wordsId}-after`} hidden>
          {after}
        </span>
      ) : null}
      {children ??
        (indicator === undefined ? (
          <ChevronDownIcon
            data-slot="panel-indicator"
            aria-hidden="true"
            className="transition-transform duration-(--bui-duration-control) group-data-[state=open]/panel-trigger:rotate-180"
          />
        ) : (
          <span data-slot="panel-indicator" aria-hidden="true" className="flex items-center">
            {indicator}
          </span>
        ))}
    </CollapsiblePrimitive.Trigger>
  )
}

/** @since 0.1.0 */
function PanelContent({
  className,
  children,
  forceMount,
  ref,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  const { toggleable, open } = React.useContext(PanelContext)
  const inner = <PanelContentContext.Provider value>{children}</PanelContentContext.Provider>
  const own = React.useRef<HTMLDivElement | null>(null)
  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      own.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  // With `forceMount` the folded content stays in the page, so what it holds keeps its state. Radix shows
  // force-mounted content at all times, so it is hidden here once the closing slide has ended.
  const { mounted } = usePresence(open, own)

  if (!toggleable) {
    return (
      <div data-slot="panel-content" className={cn("px-4 pb-4 text-sm", className)} ref={ref} {...props}>
        {inner}
      </div>
    )
  }

  return (
    <CollapsiblePrimitive.Content
      ref={setRef}
      data-slot="panel-content"
      forceMount={forceMount}
      {...(forceMount ? { hidden: !mounted } : null)}
      // The height animates from Radix's measured `--radix-collapsible-content-height`, as the accordion's does, and
      // holds at 0 from the slide's end until the content leaves or is hidden.
      className="overflow-hidden text-sm data-[state=closed]:animate-collapsible-up data-[state=closed]:fill-mode-forwards data-[state=open]:animate-collapsible-down"
      {...props}
    >
      <div data-slot="panel-content-inner" className={cn("px-4 pb-4", className)}>
        {inner}
      </div>
    </CollapsiblePrimitive.Content>
  )
}

/** @since 0.1.0 */
function PanelFooter({ className, ...props }: React.ComponentProps<"div">) {
  const inContent = React.useContext(PanelContentContext)

  return (
    <div
      data-slot="panel-footer"
      // Outside PanelContent it stays in view while the content is folded; inside, it folds with it.
      className={cn("flex items-center gap-2", inContent ? "pt-4" : "px-4 pb-4", className)}
      {...props}
    />
  )
}

export { Panel, PanelHeader, PanelTitle, PanelActions, PanelTrigger, PanelContent, PanelFooter }
