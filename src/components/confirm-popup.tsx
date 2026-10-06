"use client"

// ConfirmPopup: a small confirmation anchored to the button that asked, built on the library's Popover (Radix Popover).

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

import { Button } from "@/components/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import { Spinner } from "@/components/spinner"
import { useReturnFocus, type ReturnFocusTarget } from "@/lib/return-focus"
import { useUiStrings } from "@booleanpress/ui/provider"

interface ConfirmPopupContextValue {
  tone: "default" | "destructive"
  focusConfirm: boolean
  pending: boolean
  error: string | null
  confirm: () => void
  cancel: () => void
}

const ConfirmPopupContext = React.createContext<ConfirmPopupContextValue | null>(null)

function useConfirmPopup(part: string) {
  const context = React.useContext(ConfirmPopupContext)
  if (!context) throw new Error(`<${part}> must be inside a <ConfirmPopup>.`)
  return context
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return typeof (value as PromiseLike<unknown> | null)?.then === "function"
}

/**
 * The confirmation's root: whether it is open, what confirming does, and its tone.
 *
 * @since 0.1.1
 */
function ConfirmPopup({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
  onCancel,
  tone = "default",
  defaultFocus,
  children,
}: {
  /** Whether it is open, when you control it. Pair it with `onOpenChange`. */
  open?: boolean
  /** Whether it starts open, when it controls itself. */
  defaultOpen?: boolean
  /** Called with `true` or `false` when it opens or closes. */
  onOpenChange?: (open: boolean) => void
  /**
   * Runs when the person confirms. When it returns a promise, the confirm button shows a spinner and the popup stays
   * open until it settles: resolved, it closes; rejected, it stays open with the error's message (the provider's
   * `actionFailed` when it has none).
   */
  onConfirm?: () => unknown
  /** Called when the popup closes without confirming: Cancel, Escape, or a click outside. */
  onCancel?: () => void
  /** `destructive` paints the confirm button red and starts focus on Cancel. */
  tone?: "default" | "destructive"
  /** The button focused when the popup opens: Confirm, or Cancel when `tone` is `destructive`. */
  defaultFocus?: "confirm" | "cancel"
  children?: React.ReactNode
}) {
  const strings = useUiStrings()
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    if (!next) setError(null)
    onOpenChange?.(next)
  }

  const cancel = () => {
    // A confirmation that is running cannot be cancelled.
    if (pending) return
    setOpen(false)
    onCancel?.()
  }

  const fail = (reason: unknown) => {
    setPending(false)
    // The rejection's own message (an Error's, or a string's); a failure without one still says that it failed.
    if (reason instanceof Error && reason.message) setError(reason.message)
    else setError(typeof reason === "string" && reason ? reason : strings.actionFailed)
  }

  const confirm = () => {
    if (pending) return
    let result: unknown
    try {
      result = onConfirm?.()
    } catch (reason) {
      fail(reason)
      return
    }
    if (!isThenable(result)) {
      setOpen(false)
      return
    }
    setPending(true)
    setError(null)
    result.then(() => {
      setPending(false)
      setOpen(false)
    }, fail)
  }

  const value: ConfirmPopupContextValue = {
    tone,
    focusConfirm: (defaultFocus ?? (tone === "destructive" ? "cancel" : "confirm")) === "confirm",
    pending,
    error,
    confirm,
    cancel,
  }

  return (
    <ConfirmPopupContext.Provider value={value}>
      <Popover
        modal
        open={open}
        onOpenChange={(next) => {
          if (next) setOpen(true)
          else cancel()
        }}
      >
        {children}
      </Popover>
    </ConfirmPopupContext.Provider>
  )
}

/**
 * The button that asks. Focus returns to it when the popup closes.
 *
 * @since 0.1.1
 */
function ConfirmPopupTrigger(props: React.ComponentProps<typeof PopoverTrigger>) {
  return <PopoverTrigger data-slot="confirm-popup-trigger" {...props} />
}

/**
 * The popup: an icon and the message (or your own content), Cancel and Confirm, and an arrow to the trigger.
 *
 * @since 0.1.1
 */
function ConfirmPopupContent({
  className,
  message,
  icon,
  confirmLabel,
  cancelLabel,
  side = "bottom",
  align = "start",
  returnFocusTo,
  children,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onInteractOutside,
  ...props
}: Omit<React.ComponentProps<typeof PopoverContent>, "children"> & {
  /** The question. */
  message?: React.ReactNode
  /** An icon before the message, 20 px. */
  icon?: React.ReactNode
  /** The confirm button's text. Defaults to the provider's `confirm`, or `delete` when `tone` is `destructive`. */
  confirmLabel?: React.ReactNode
  /** The cancel button's text. Defaults to the provider's `cancel`. */
  cancelLabel?: React.ReactNode
  /** Where focus goes when the popup closes and its trigger is gone, for example after the confirmed delete. */
  returnFocusTo?: ReturnFocusTarget
  /** Your own content in place of the icon and message; it names the popup. */
  children?: React.ReactNode
}) {
  const context = useConfirmPopup("ConfirmPopupContent")
  const strings = useUiStrings()
  const bodyId = React.useId()
  const confirmRef = React.useRef<HTMLButtonElement>(null)
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const { pending, error, tone, focusConfirm } = context
  const destructive = tone === "destructive"

  const focusHandlers = useReturnFocus(returnFocusTo, {
    onOpenAutoFocus: (event) => {
      onOpenAutoFocus?.(event)
      if (event.defaultPrevented) return
      event.preventDefault()
      ;(focusConfirm ? confirmRef : cancelRef).current?.focus()
    },
    onCloseAutoFocus,
  })

  return (
    <PopoverContent
      data-slot="confirm-popup-content"
      data-bui-motion="overlay"
      data-tone={tone}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={bodyId}
      aria-busy={pending || undefined}
      side={side}
      align={align}
      // The arrow is the 10 px between the trigger and the popup.
      sideOffset={0}
      collisionPadding={8}
      {...focusHandlers}
      onEscapeKeyDown={(event) => {
        onEscapeKeyDown?.(event)
        if (pending) event.preventDefault()
      }}
      onInteractOutside={(event) => {
        onInteractOutside?.(event)
        if (pending) event.preventDefault()
      }}
      // The visual target's confirm popup: 6px radius, the overlay shadow, no padding of its own (the library's
      // Popover: 8px, a softer shadow, 16px padding), as wide as its message up to 22rem.
      className={cn("w-max max-w-[min(22rem,calc(100vw-1rem))] rounded-md p-0 shadow-md", className)}
      {...props}
    >
      <div id={bodyId} data-slot="confirm-popup-body" className="flex items-center gap-2 p-2.5 text-sm/normal">
        {children ?? (
          <>
            {icon && (
              <span
                data-slot="confirm-popup-icon"
                aria-hidden="true"
                className="flex size-5 shrink-0 items-center justify-center text-foreground [&_svg:not([class*='size-'])]:size-5"
              >
                {icon}
              </span>
            )}
            <p data-slot="confirm-popup-message" className="min-w-0 text-foreground">
              {message}
            </p>
          </>
        )}
      </div>
      {error && (
        <p data-slot="confirm-popup-error" role="alert" className="-mt-1 px-2.5 pb-2.5 text-sm/normal text-destructive-strong">
          {error}
        </p>
      )}
      <div data-slot="confirm-popup-footer" className="flex justify-end gap-1.5 px-2.5 pb-2.5">
        <Button
          ref={cancelRef}
          type="button"
          size="sm"
          variant="outline"
          data-slot="confirm-popup-cancel"
          aria-disabled={pending || undefined}
          // The visual target's secondary outlined button: the light edge and muted text.
          className="text-muted-foreground aria-disabled:pointer-events-none aria-disabled:opacity-60"
          onClick={context.cancel}
        >
          {cancelLabel ?? strings.cancel}
        </Button>
        <Button
          ref={confirmRef}
          type="button"
          size="sm"
          variant={destructive ? "destructive" : "default"}
          data-slot="confirm-popup-action"
          data-loading={pending || undefined}
          aria-busy={pending || undefined}
          aria-disabled={pending || undefined}
          className="aria-disabled:pointer-events-none aria-disabled:opacity-60"
          onClick={context.confirm}
        >
          {pending && <Spinner />}
          {confirmLabel ?? (destructive ? strings.delete : strings.confirm)}
        </Button>
      </div>
      <PopoverPrimitive.Arrow asChild width={20} height={10}>
        {/* A 20 × 10 px arrow in the popup's fill with its edge on the two slanted sides, overlapping the popup's own
            edge by 1 px so the edge breaks under it. */}
        <svg
          data-slot="confirm-popup-arrow"
          viewBox="0 0 20 10"
          aria-hidden="true"
          className="block -translate-y-px overflow-visible fill-popover stroke-border"
        >
          <polygon points="0,0 20,0 10,10" stroke="none" />
          <polyline points="0,0 10,10 20,0" fill="none" strokeWidth="1" />
        </svg>
      </PopoverPrimitive.Arrow>
    </PopoverContent>
  )
}

export { ConfirmPopup, ConfirmPopupTrigger, ConfirmPopupContent }
