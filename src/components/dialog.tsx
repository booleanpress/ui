"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Button } from "@/components/button"
import { useReturnFocus, type ReturnFocusTarget } from "@/lib/return-focus"
import { useUiStrings } from "@booleanpress/ui/provider"

// boolean-ui patch: named widths replace per-screen `sm:max-w-*` classes (spec 001, API).
const DIALOG_SIZES: Record<"sm" | "md" | "lg", string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
}

// boolean-ui patch: named places in the window (stock: centred only). The edges keep 1rem from the window, and the
// top one stays below the WordPress admin bar; `start` and `end` follow the reading direction.
const DIALOG_POSITIONS: Record<"center" | "top" | "bottom" | "start" | "end", string> = {
  center:
    "top-[calc(50%+var(--wp-admin--admin-bar--height,0px)/2)] start-[50%] translate-x-[-50%] rtl:-translate-x-[-50%] translate-y-[-50%]",
  top: "top-[calc(var(--wp-admin--admin-bar--height,0px)+1rem)] start-[50%] translate-x-[-50%] rtl:-translate-x-[-50%]",
  bottom: "bottom-4 start-[50%] translate-x-[-50%] rtl:-translate-x-[-50%]",
  start: "top-[calc(50%+var(--wp-admin--admin-bar--height,0px)/2)] start-4 translate-y-[-50%]",
  end: "top-[calc(50%+var(--wp-admin--admin-bar--height,0px)/2)] end-4 translate-y-[-50%]",
}

const TABBABLE =
  'a[href], area[href], button, input:not([type="hidden"]), select, textarea, iframe, [contenteditable="true"], [tabindex]'

/** The elements Tab reaches inside `root`, in document order. */
function tabbables(root: ParentNode) {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.hasAttribute("disabled") &&
      !element.hasAttribute("data-radix-focus-guard") &&
      !element.closest("[hidden], [inert]")
  )
}

/**
 * Whether the dialog is modal, from the root to its content: a non-modal dialog has no mask to scroll in and stays
 * open while the page behind it is used.
 */
const DialogModalContext = React.createContext(true)

/** @since 0.1.1 */
function Dialog({
  modal = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  // boolean-ui patch: the root shares `modal` with DialogContent (stock: Radix keeps it to itself).
  return (
    <DialogModalContext.Provider value={modal}>
      <DialogPrimitive.Root data-slot="dialog" modal={modal} {...props} />
    </DialogModalContext.Provider>
  )
}

/** @since 0.1.1 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/** @since 0.1.1 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/** @since 0.1.1 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/** @since 0.1.1 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      // boolean-ui patch: the BooleanPress look — the backdrop is the mask token, 40 % black, 60 % in dark (stock:
      // bg-black/50).
      className={cn(
        "fixed inset-0 z-50 bg-mask data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * The dialog's panel, with its backdrop and the close button.
 *
 * @since 0.1.1
 */
function DialogContent({
  className,
  children,
  size = "md",
  position = "center",
  scroll = "inside",
  maximizable = false,
  maximized: maximizedProp,
  defaultMaximized = false,
  onMaximizedChange,
  showCloseButton = true,
  returnFocusTo,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onInteractOutside,
  onPointerDownOutside,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /**
   * Maximum width: 384, 512 or 672 px; `full` fills the window below the WordPress admin bar, with square corners.
   * @since 0.1.1 `full`.
   */
  size?: "sm" | "md" | "lg" | "full"
  /**
   * Where it sits in the window: centred, or 1rem from the top, bottom, start or end edge. A dialog that scrolls
   * `outside` is always centred across the window.
   * @since 0.1.1
   */
  position?: "center" | "top" | "bottom" | "start" | "end"
  /**
   * `inside` keeps the dialog within the window and scrolls its `DialogBody`; `outside` lets a tall dialog run past
   * the window and scrolls the whole dialog on its mask. A non-modal dialog always scrolls inside.
   * @since 0.1.1
   */
  scroll?: "inside" | "outside"
  /**
   * Render a button beside the × that fills the window with the dialog and restores it.
   * @since 0.1.1
   */
  maximizable?: boolean
  /**
   * Whether it fills the window, when you control it. Pair it with `onMaximizedChange`.
   * @since 0.1.1
   */
  maximized?: boolean
  /**
   * Whether it opens filling the window, when it controls itself.
   * @since 0.1.1
   */
  defaultMaximized?: boolean
  /**
   * Called with `true` or `false` when the maximise button is pressed.
   * @since 0.1.1
   */
  onMaximizedChange?: (maximized: boolean) => void
  /** Render the × button. */
  showCloseButton?: boolean
  /**
   * Where focus goes on close when the element that opened the overlay no longer exists — for example after the
   * confirmed action deleted the row it sat in.
   */
  returnFocusTo?: ReturnFocusTarget
}) {
  const strings = useUiStrings()
  const modal = React.useContext(DialogModalContext)
  // The mask is the scrolling box, and a non-modal dialog has none.
  const outside = scroll === "outside" && modal
  const opener = React.useRef<Element | null>(null)
  const focusHandlers = useReturnFocus(returnFocusTo, {
    onOpenAutoFocus: (event) => {
      opener.current = document.activeElement
      onOpenAutoFocus?.(event)
      // boolean-ui patch: a dialog that scrolls on its mask takes focus itself, so it opens at its top and a screen
      // reader starts with its title (stock: the first control, which may sit at the end of a long text).
      if (outside && !event.defaultPrevented && event.target instanceof HTMLElement) {
        event.preventDefault()
        event.target.focus({ preventScroll: true })
      }
    },
    onCloseAutoFocus,
  })
  const [maximizedState, setMaximizedState] = React.useState(defaultMaximized)
  const maximized = maximizedProp ?? maximizedState
  const full = size === "full" || maximized
  const sized = DIALOG_SIZES[size as keyof typeof DIALOG_SIZES] ?? DIALOG_SIZES.md

  const toggleMaximized = () => {
    if (maximizedProp === undefined) setMaximizedState(!maximized)
    onMaximizedChange?.(!maximized)
  }

  const handleInteractOutside: typeof onInteractOutside = (event) => {
    onInteractOutside?.(event)
    // boolean-ui patch: a non-modal dialog stays open while the page behind it is used: a click or Tab outside it
    // does not close it (stock: it closes, as a popover does).
    if (!modal) event.preventDefault()
  }

  const handleKeyDown: typeof onKeyDown = (event) => {
    onKeyDown?.(event)
    // boolean-ui patch: Tab past the last control of a non-modal dialog moves on to the page after the element that
    // opened it, and Shift+Tab before the first goes back to that element, as if the dialog sat beside it (stock: Tab
    // loops inside a non-modal dialog too, so a keyboard cannot leave it).
    if (modal || event.defaultPrevented || event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return
    const panel = event.currentTarget
    const inside = tabbables(panel)
    if (inside.length > 0 && document.activeElement !== (event.shiftKey ? inside[0] : inside[inside.length - 1])) return
    const page = tabbables(document).filter((element) => !panel.contains(element))
    const from = opener.current instanceof HTMLElement ? page.indexOf(opener.current) : -1
    const upTo = page.slice(0, from + 1)
    const after = page.slice(from + 1)
    const order = event.shiftKey ? [...upTo.reverse(), ...after.reverse()] : [...after, ...upTo]
    for (const element of order) {
      element.focus()
      if (document.activeElement === element) {
        event.preventDefault()
        return
      }
    }
  }

  const handlePointerDownOutside: typeof onPointerDownOutside = (event) => {
    onPointerDownOutside?.(event)
    // Dragging the scrolling mask's scrollbar is not a click outside the dialog.
    const mask = event.target
    if (outside && mask instanceof HTMLElement && mask.dataset.slot === "dialog-overlay") {
      const left = mask.getBoundingClientRect().left + mask.clientLeft
      const x = event.detail.originalEvent.clientX
      if (x < left || x > left + mask.clientWidth) event.preventDefault()
    }
  }

  const content = (
    <DialogPrimitive.Content
      data-slot="dialog-content"
      data-size={full ? "full" : size}
      data-position={position}
      data-scroll={outside ? "outside" : "inside"}
      data-maximized={maximizable ? maximized : undefined}
      {...focusHandlers}
      onInteractOutside={handleInteractOutside}
      onPointerDownOutside={handlePointerDownOutside}
      onKeyDown={handleKeyDown}
      className={cn(
        // boolean-ui patch: the floating-surface tokens (stock: bg-background); a flex column whose height stops
        // below the WordPress admin bar, so a tall DialogBody scrolls while the header and footer stay visible;
        // centred in the area under the admin bar. The BooleanPress look: 12px radius, 1.125rem padding and gap,
        // the modal shadow (stock: rounded-lg, p-6, gap-4, shadow-lg).
        "z-50 flex w-full flex-col gap-4.5 overflow-y-auto border bg-popover p-4.5 text-popover-foreground shadow-xl duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        // boolean-ui patch: `full` and a maximised dialog fill the window below the admin bar, with square corners;
        // with `scroll="outside"` the panel sits in the mask's flow, as tall as its content (stock: neither).
        outside
          ? cn("relative", full ? "h-full max-w-none rounded-none" : cn("row-start-2 max-w-full overflow-visible rounded-xl", sized))
          : full
            ? "fixed start-0 top-[var(--wp-admin--admin-bar--height,0px)] h-[calc(100dvh-var(--wp-admin--admin-bar--height,0px))] max-w-none rounded-none"
            : cn(
                "fixed max-h-[calc(100dvh-var(--wp-admin--admin-bar--height,0px)-2rem)] max-w-[calc(100%-2rem)] rounded-xl",
                DIALOG_POSITIONS[position] ?? DIALOG_POSITIONS.center,
                sized
              ),
        className
      )}
      {...props}
    >
      {children}
      {maximizable && size !== "full" && (
        // boolean-ui patch: new part — the maximise button, the ×'s twin 0.5rem before it, named from the provider's
        // `maximize` and `restore` strings as it toggles.
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-slot="dialog-maximize"
          onClick={toggleMaximized}
          className={cn(
            "absolute top-4.5 rounded-full text-muted-foreground hover:bg-subtle hover:text-muted-foreground active:bg-accent [&_svg:not([class*='size-'])]:size-3.5",
            showCloseButton ? "end-15.5" : "end-4.5"
          )}
        >
          {maximized ? <Minimize2Icon /> : <Maximize2Icon />}
          <span className="sr-only">{maximized ? strings.restore : strings.maximize}</span>
        </Button>
      )}
      {showCloseButton && (
        // boolean-ui patch: the system's 36 px icon button (stock: a bare 16 px icon), at the inline end, centred
        // on the title's first line, named from the provider (PATCHES.md §1, rows 1–2). The BooleanPress look: round,
        // muted grey, a 14 px icon, the hovered-surface fill on hover.
        <DialogPrimitive.Close data-slot="dialog-close" asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute end-4.5 top-4.5 rounded-full text-muted-foreground hover:bg-subtle hover:text-muted-foreground active:bg-accent [&_svg:not([class*='size-'])]:size-3.5"
          >
            <XIcon />
            <span className="sr-only">{strings.close}</span>
          </Button>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  )

  return (
    <DialogPortal data-slot="dialog-portal">
      {outside ? (
        // boolean-ui patch: with `scroll="outside"` the mask scrolls and holds the panel, centred when it is short and
        // 2rem from the top when it is tall (the Radix "scrollable overlay" pattern).
        <DialogOverlay
          className={cn(
            "grid justify-items-center overflow-y-auto",
            // The panel sits in the middle row: the rows around it share the free space while it is short, and keep
            // 2rem each when it is taller than the window, so its top stays reachable and its end clears the edge.
            full
              ? "top-[var(--wp-admin--admin-bar--height,0px)]"
              : "grid-rows-[minmax(2rem,1fr)_auto_minmax(2rem,1fr)] px-4 pt-[var(--wp-admin--admin-bar--height,0px)]"
          )}
        >
          {content}
        </DialogOverlay>
      ) : (
        <>
          <DialogOverlay />
          {content}
        </>
      )}
    </DialogPortal>
  )
}

/** @since 0.1.1 */
function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      // boolean-ui patch: logical alignment for RTL (stock: sm:text-left), and room for the × so a long title
      // wraps before it. Beside the ×, the title's first line is padded to the button's 36 px, so the two share a
      // centre line.
      className={cn(
        "flex shrink-0 flex-col gap-2 text-center sm:text-start has-[~[data-slot=dialog-close]]:pe-11 has-[~[data-slot=dialog-close]]:*:data-[slot=dialog-title]:py-[0.28125rem]",
        // boolean-ui patch: room for the maximise button too, beside the × or alone in its place.
        "has-[~[data-slot=dialog-maximize]]:pe-11 has-[~[data-slot=dialog-maximize]]:*:data-[slot=dialog-title]:py-[0.28125rem] has-[~[data-slot=dialog-maximize]]:has-[~[data-slot=dialog-close]]:pe-22",
        className
      )}
      {...props}
    />
  )
}

/**
 * The part of a dialog that scrolls when its content is taller than the viewport; the header and footer stay put.
 *
 * @since 0.1.1
 */
// boolean-ui patch: new part (spec 001, Anatomy).
function DialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("-mx-4.5 min-h-0 flex-1 overflow-y-auto px-4.5", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const strings = useUiStrings()

  return (
    <div
      data-slot="dialog-footer"
      // boolean-ui patch: the BooleanPress look — 0.375rem between the buttons (stock: gap-2).
      className={cn(
        "flex shrink-0 flex-col-reverse gap-1.5 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          {/* boolean-ui patch: the label comes from the provider. */}
          <Button variant="outline">{strings.close}</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

/** @since 0.1.1 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      // boolean-ui patch: the BooleanPress look — 18 px semibold on a 27 px line (stock: leading-none).
      className={cn("text-lg/normal font-semibold", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      // boolean-ui patch: the BooleanPress look — 14 px on a 21 px line (stock: text-sm's 20 px line).
      className={cn("text-sm/normal text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
