"use client"

// Confirm: an imperative confirmation built on the library's AlertDialog — `await confirm({ … })` resolves true or false.

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/alert-dialog"
import { Button } from "@/components/button"
import { Spinner } from "@/components/spinner"
import { watchFocusHandoff, type ReturnFocusTarget } from "@/lib/return-focus"
import { useUiStrings } from "@booleanpress/ui/provider"

/**
 * What `confirm()` asks, and how.
 *
 * @since 0.1.0
 */
interface ConfirmOptions {
  /** The question, as the dialog's title. Defaults to the provider's `confirmTitle` ("Are you sure?"). */
  title?: React.ReactNode
  /** What happens if the person confirms. */
  description?: React.ReactNode
  /** The confirm button's text. Defaults to the provider's `confirm`, or `delete` when `tone` is `destructive`. */
  confirmLabel?: React.ReactNode
  /** The cancel button's text. Defaults to the provider's `cancel`. */
  cancelLabel?: React.ReactNode
  /** `destructive` paints the confirm button red and starts focus on Cancel. */
  tone?: "default" | "destructive"
  /** An icon before the description, 24 px. */
  icon?: React.ReactNode
  /** The button focused when the dialog opens: Confirm, or Cancel when `tone` is `destructive`. */
  defaultFocus?: "confirm" | "cancel"
  /** Render the × button, which cancels. `true` by default. */
  showCloseButton?: boolean
  /**
   * Runs when the person confirms. When it returns a promise, the confirm button shows a spinner and the dialog stays
   * open until it settles: resolved, the dialog closes and `confirm()` resolves `true`; rejected, the dialog stays open
   * with the error's message (the provider's `actionFailed` when it has none), for another try or Cancel.
   */
  onConfirm?: () => unknown
  /** Where focus goes when the dialog closes and the element that had focus before it opened is gone. */
  returnFocusTo?: ReturnFocusTarget
}

/**
 * The function `useConfirm()` returns: opens a confirmation and resolves `true` when it is confirmed, `false` when it
 * is cancelled.
 *
 * @since 0.1.0
 */
type ConfirmFunction = (options?: ConfirmOptions) => Promise<boolean>

interface ConfirmRequest {
  id: number
  options: ConfirmOptions
  resolve: (confirmed: boolean) => void
}

const ConfirmContext = React.createContext<ConfirmFunction | null>(null)
ConfirmContext.displayName = "ConfirmContext"

const isLost = (element: Element | null) => !element || element === document.body || !element.isConnected

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return typeof (value as PromiseLike<unknown> | null)?.then === "function"
}

/** The rejection's own message: an Error's, or a string's. */
function errorMessage(reason: unknown) {
  if (reason instanceof Error && reason.message) return reason.message
  return typeof reason === "string" && reason ? reason : null
}

/**
 * Renders the confirmation dialog for `useConfirm()` below it. Render it once, inside `BooleanUIProvider`, around the
 * part of the app that asks. Confirmations asked while one is open wait their turn, one at a time.
 *
 * @since 0.1.0
 */
function ConfirmProvider({ children }: { children?: React.ReactNode }) {
  const [queue, setQueue] = React.useState<ConfirmRequest[]>([])
  const [open, setOpen] = React.useState(false)
  // The same queue for the handlers, which run between renders: the head is shown (open, or closing).
  const queueRef = React.useRef<ConfirmRequest[]>([])
  const phase = React.useRef<"idle" | "open" | "closing">("idle")
  // The element that had focus when the first of a run of confirmations was asked; focus goes back to it at the end.
  const restore = React.useRef<Element | null>(null)
  // Records, for the same run, where the page tried to send focus meanwhile: the trigger of a menu whose item asked
  // and then left the page with its menu.
  const stopWatching = React.useRef<(() => HTMLElement | null) | null>(null)
  const nextId = React.useRef(0)

  const confirm = React.useCallback<ConfirmFunction>(
    (options = {}) =>
      new Promise<boolean>((resolve) => {
        if (queueRef.current.length === 0) {
          restore.current = document.activeElement
          stopWatching.current?.()
          stopWatching.current = watchFocusHandoff((element) => !!element.closest('[data-slot="confirm-content"]'))
        }
        nextId.current += 1
        const next = [...queueRef.current, { id: nextId.current, options, resolve }]
        queueRef.current = next
        setQueue(next)
        if (phase.current === "idle") {
          phase.current = "open"
          setOpen(true)
        }
      }),
    []
  )

  const settle = React.useCallback((id: number, confirmed: boolean) => {
    const head = queueRef.current[0]
    if (!head || head.id !== id || phase.current !== "open") return
    phase.current = "closing"
    head.resolve(confirmed)
    setOpen(false)
  }, [])

  // The closed dialog has left the page (after its exit animation): the next waiting confirmation opens.
  const exited = React.useCallback(() => {
    if (phase.current !== "closing") return
    const rest = queueRef.current.slice(1)
    queueRef.current = rest
    setQueue(rest)
    if (rest.length > 0) {
      phase.current = "open"
      setOpen(true)
    } else {
      phase.current = "idle"
    }
  }, [])

  const returnFocus = React.useCallback((event: Event, options: ConfirmOptions) => {
    event.preventDefault()
    // The next confirmation takes focus itself.
    if (phase.current !== "idle") return
    const before = restore.current
    restore.current = null
    const handoff = stopWatching.current?.() ?? null
    stopWatching.current = null
    // The element that asked; or, when it left the page with the menu it sat in, that menu's trigger; or
    // `returnFocusTo`.
    const target = !isLost(before)
      ? (before as HTMLElement)
      : !isLost(handoff)
        ? handoff
        : typeof options.returnFocusTo === "function"
          ? options.returnFocusTo()
          : options.returnFocusTo?.current
    target?.focus()
  }, [])

  const cancelAll = React.useCallback(() => {
    for (const request of queueRef.current) request.resolve(false)
    queueRef.current = []
  }, [])

  // Unmounted with confirmations waiting: each resolves `false`, so no caller waits for ever.
  React.useEffect(
    () => () => {
      cancelAll()
      stopWatching.current?.()
      stopWatching.current = null
    },
    [cancelAll]
  )

  const current = queue[0]

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!next && current) settle(current.id, false)
        }}
      >
        {current && (
          <ConfirmDialog
            key={current.id}
            request={current}
            onSettle={settle}
            onExited={exited}
            onReturnFocus={returnFocus}
          />
        )}
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}

/** Calls `callback` when it leaves the page: inside the dialog's content, once the closed dialog's exit animation ends. */
function OnUnmount({ callback }: { callback: () => void }) {
  React.useEffect(() => callback, [callback])
  return null
}

function ConfirmDialog({
  request,
  onSettle,
  onExited,
  onReturnFocus,
}: {
  request: ConfirmRequest
  onSettle: (id: number, confirmed: boolean) => void
  onExited: () => void
  onReturnFocus: (event: Event, options: ConfirmOptions) => void
}) {
  const strings = useUiStrings()
  const { options, id } = request
  const { title, description, icon, tone = "default", confirmLabel, cancelLabel, showCloseButton = true } = options
  const destructive = tone === "destructive"
  const focusConfirm = (options.defaultFocus ?? (destructive ? "cancel" : "confirm")) === "confirm"
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const confirmRef = React.useRef<HTMLButtonElement>(null)

  const fail = (reason: unknown) => {
    setPending(false)
    // A failure without a message of its own still says that it failed.
    setError(errorMessage(reason) ?? strings.actionFailed)
    confirmRef.current?.focus()
  }

  const handleConfirm = () => {
    if (pending) return
    let result: unknown
    try {
      result = options.onConfirm?.()
    } catch (reason) {
      fail(reason)
      return
    }
    if (!isThenable(result)) {
      onSettle(id, true)
      return
    }
    setPending(true)
    setError(null)
    result.then(() => onSettle(id, true), fail)
  }

  const cancel = () => {
    if (!pending) onSettle(id, false)
  }

  return (
    <AlertDialogContent
      data-slot="confirm-content"
      data-bui-motion="modal"
      data-tone={tone}
      aria-busy={pending || undefined}
      {...(description ? {} : { "aria-describedby": undefined })}
      onOpenAutoFocus={(event) => {
        if (!focusConfirm) return
        event.preventDefault()
        confirmRef.current?.focus()
      }}
      onCloseAutoFocus={(event) => onReturnFocus(event, options)}
      onEscapeKeyDown={(event) => {
        // A confirmation that is running cannot be cancelled.
        if (pending) event.preventDefault()
      }}
      // The visual target's confirmation: 352 px wide (the library's AlertDialog: 512 px).
      className="data-[size=default]:sm:max-w-[22rem]"
    >
      <AlertDialogHeader data-slot="confirm-header" className={cn(!(description || icon) && "grid-rows-1")}>
        <AlertDialogTitle
          data-slot="confirm-title"
          // Beside the ×, the title keeps clear of it and is padded to the button's 36 px, so the two share a centre line.
          className={cn(showCloseButton && "pe-11 py-[0.28125rem]")}
        >
          {title ?? strings.confirmTitle}
        </AlertDialogTitle>
        {(description || icon) && (
          <div data-slot="confirm-body" className="flex items-center gap-3.5">
            {icon && (
              <span
                data-slot="confirm-icon"
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center text-foreground [&_svg:not([class*='size-'])]:size-6"
              >
                {icon}
              </span>
            )}
            {description && (
              <AlertDialogDescription data-slot="confirm-description" className="min-w-0 flex-1">
                {description}
              </AlertDialogDescription>
            )}
          </div>
        )}
      </AlertDialogHeader>
      {error && (
        <p data-slot="confirm-error" role="alert" className="text-sm/normal text-destructive-strong">
          {error}
        </p>
      )}
      <AlertDialogFooter data-slot="confirm-footer">
        <AlertDialogCancel
          data-slot="confirm-cancel"
          variant="secondary"
          aria-disabled={pending || undefined}
          className="aria-disabled:pointer-events-none aria-disabled:opacity-60"
          onClick={(event) => {
            event.preventDefault()
            cancel()
          }}
        >
          {cancelLabel ?? strings.cancel}
        </AlertDialogCancel>
        <Button
          ref={confirmRef}
          type="button"
          data-slot="confirm-action"
          variant={destructive ? "destructive" : "default"}
          data-loading={pending || undefined}
          aria-busy={pending || undefined}
          aria-disabled={pending || undefined}
          className="aria-disabled:pointer-events-none aria-disabled:opacity-60"
          onClick={handleConfirm}
        >
          {pending && <Spinner />}
          {confirmLabel ?? (destructive ? strings.delete : strings.confirm)}
        </Button>
      </AlertDialogFooter>
      <OnUnmount callback={onExited} />
      {showCloseButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-slot="confirm-close"
          aria-disabled={pending || undefined}
          onClick={cancel}
          // The × of the library's Dialog: round, muted, a 14 px icon, at the inline end of the title.
          className="absolute end-4.5 top-4.5 rounded-full text-muted-foreground hover:bg-subtle hover:text-muted-foreground active:bg-accent aria-disabled:pointer-events-none aria-disabled:opacity-60 [&_svg:not([class*='size-'])]:size-3.5"
        >
          <XIcon aria-hidden="true" />
          <span className="sr-only">{strings.close}</span>
        </Button>
      )}
    </AlertDialogContent>
  )
}

/**
 * Returns `confirm(options)`, which opens a confirmation and resolves `true` or `false`. Throws outside a
 * `ConfirmProvider`.
 *
 * @since 0.1.0
 */
function useConfirm(): ConfirmFunction {
  const confirm = React.useContext(ConfirmContext)
  if (!confirm) throw new Error("useConfirm() must be called inside a <ConfirmProvider>.")
  return confirm
}

export { ConfirmProvider, useConfirm }
export type { ConfirmFunction, ConfirmOptions }
