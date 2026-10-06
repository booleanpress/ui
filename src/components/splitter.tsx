"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { useUiConfig } from "@booleanpress/ui/provider"

// boolean-ui patch: the panels of a horizontal splitter in a right-to-left page take their direction from here, and the
// handles a disabled splitter's state (see Splitter).
const SplitterContext = React.createContext<{ panelDir?: "rtl"; disabled?: boolean }>({})

/**
 * Panels side by side, or stacked, with handles between them that resize them by pointer or keyboard.
 *
 * @since 0.1.0
 */
// boolean-ui patch: renamed from ResizablePanelGroup.
function Splitter({
  className,
  orientation = "horizontal",
  disabled,
  ...props
}: ResizablePrimitive.GroupProps) {
  const { dir } = useUiConfig()
  // boolean-ui patch: react-resizable-panels has no right-to-left mode: in a right-to-left row its pointer drag and
  // arrow keys move the handle the wrong way. A horizontal splitter therefore lays its panels out left to right, and
  // gives each panel's content the page's direction back.
  const rtlRow = dir === "rtl" && orientation === "horizontal"
  // boolean-ui patch: a disabled splitter disables its handles too, so they leave the tab order and say so
  // (`aria-disabled`); the library alone left them focusable and announced as operable.
  const context = React.useMemo(
    () => ({ panelDir: rtlRow ? ("rtl" as const) : undefined, disabled }),
    [rtlRow, disabled]
  )

  return (
    <SplitterContext.Provider value={context}>
      <ResizablePrimitive.Group
        data-slot="splitter"
        // boolean-ui patch: the orientation as a data attribute, for styling (stock read `aria-orientation`, which
        // version 4's group no longer renders; the library sets the flex direction inline).
        data-orientation={orientation}
        orientation={orientation}
        disabled={disabled}
        dir={rtlRow ? "ltr" : undefined}
        // boolean-ui patch: the BooleanPress look — the visual target's frame: a 1 px edge, 6 px radius and the card
        // surface; a splitter nested in a panel drops its frame (stock: no frame).
        className={cn(
          "flex h-full w-full rounded-md border bg-card text-card-foreground in-data-[slot=splitter-panel]:rounded-none in-data-[slot=splitter-panel]:border-0",
          className
        )}
        {...props}
      />
    </SplitterContext.Provider>
  )
}

/** @since 0.1.0 */
// boolean-ui patch: renamed from ResizablePanel.
function SplitterPanel({ ...props }: ResizablePrimitive.PanelProps) {
  const { panelDir } = React.useContext(SplitterContext)
  return <ResizablePrimitive.Panel data-slot="splitter-panel" dir={panelDir} {...props} />
}

/**
 * The bar between two panels: drag it, or focus it and use the arrow keys, Home, End and Enter.
 *
 * @since 0.1.0
 */
// boolean-ui patch: renamed from ResizableHandle.
function SplitterHandle({
  withHandle,
  className,
  disabled,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  /** Show a grip on the bar. */
  withHandle?: boolean
}) {
  const context = React.useContext(SplitterContext)
  return (
    <ResizablePrimitive.Separator
      data-slot="splitter-handle"
      disabled={disabled ?? context.disabled}
      // boolean-ui patch: focus outlines the handle inside the bar, 1 px and 2 px away, as the visual target does
      // (stock: a ring around the whole bar); 60 % opacity when disabled.
      className={cn(
        "group/splitter-handle relative flex w-px items-center justify-center bg-border outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 aria-disabled:opacity-60 aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {/* boolean-ui patch: the visual target's handle — a 24 px part of the bar that carries the focus outline, and
          the grip when `withHandle` is set: 24 px tall on the card surface with a 1 px edge (stock: 16 px on the
          edge colour, rendered only with `withHandle`). */}
      <div
        aria-hidden="true"
        data-slot="splitter-handle-grip"
        className={cn(
          "z-10 flex h-6 items-center justify-center rounded-sm transition-[outline-color] duration-(--bui-duration-control) group-focus-visible/splitter-handle:outline-1 group-focus-visible/splitter-handle:outline-offset-2 group-focus-visible/splitter-handle:outline-ring group-focus-visible/splitter-handle:outline-solid",
          withHandle ? "w-3 border bg-card text-muted-foreground" : "w-px"
        )}
      >
        {withHandle && <GripVerticalIcon className="size-2.5" />}
      </div>
    </ResizablePrimitive.Separator>
  )
}

export { Splitter, SplitterHandle, SplitterPanel }
