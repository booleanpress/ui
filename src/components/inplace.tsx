"use client"

// Inplace: a value shown as text that turns into a field on click or Enter, and back on Enter, blur or Escape. Built on
// the library's Input and Textarea, or an editor of your own.

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { cn, fillString } from "@/lib/utils"

import { Input } from "@/components/input"
import { Spinner } from "@/components/spinner"
import { Textarea } from "@/components/textarea"
import {
  useControlSize,
  useFieldVariant,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

/**
 * What `renderEditor` receives: the draft, its setter, and the props that make a field part of the inplace (spread
 * them on it, `ref` included, so it takes focus, reports errors and is named).
 *
 * @since 0.1.0
 */
interface InplaceEditorProps {
  value: string
  onValueChange: (value: string) => void
  save: () => void
  cancel: () => void
  fieldProps: {
    ref: React.RefCallback<HTMLElement>
    id: string
    "aria-label": string
    "aria-invalid": true | undefined
    "aria-describedby": string | undefined
    "aria-busy": true | undefined
    disabled: boolean
  }
}

/** Renders `renderEditor` as a component of its own, so the editor may use hooks. */
function CustomEditor({ render, ...props }: InplaceEditorProps & { render: (props: InplaceEditorProps) => React.ReactNode }) {
  return render(props)
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return typeof (value as PromiseLike<unknown> | null)?.then === "function"
}

// The save and cancel buttons by size: as tall as the field, about as wide; the icon scales with it.
const buttonSizes: Record<ControlSize, string> = {
  sm: "w-7 [&_svg]:size-3",
  default: "w-9 [&_svg]:size-3.5",
  lg: "w-[2.625rem] [&_svg]:size-4",
}

// The display's padding and text match the field's, so switching modes does not move the text.
const displaySizes: Record<ControlSize, string> = {
  sm: "px-2 py-1 text-xs/normal",
  default: "px-2.5 py-1.5 text-sm/normal",
  lg: "px-3 py-2 text-base/normal",
}

/**
 * A value people edit where it is shown. Click or Enter opens the field; Enter (Ctrl+Enter or ⌘+Enter in a multi-line
 * field), the ✓ button or leaving the field saves; Escape or the × cancels; focus then returns to the value.
 *
 * @since 0.1.0
 */
function Inplace({
  className,
  label,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSave,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placeholder,
  multiline = false,
  disabled = false,
  size,
  variant,
  saveOnBlur = true,
  showButtons = true,
  renderDisplay,
  renderEditor,
  onKeyDown,
  onBlur,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** What the value is ("Mailer name"): the field's name, and the display's hint, "Edit {label}". */
  label: string
  /** The value, when you control it. Update it in `onSave` or `onValueChange`. */
  value?: string
  /** The starting value, when it controls itself. */
  defaultValue?: string
  /** Called with the new value once it is saved. */
  onValueChange?: (value: string) => void
  /**
   * Called with the new value when it is saved. Return a promise to show a spinner until it settles; reject it to keep
   * the field open with the error's message (or the provider's `saveFailed`). Not called when the value is unchanged.
   */
  onSave?: (value: string) => unknown
  /** Whether the field is open, when you control it. Pair it with `onOpenChange`. */
  open?: boolean
  /** Whether it starts with the field open. */
  defaultOpen?: boolean
  /** Called with `true` or `false` when the field opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Shown, muted, when the value is empty, and in the empty field. */
  placeholder?: string
  /** Edit in a Textarea; Enter then makes a new line and Ctrl+Enter or ⌘+Enter saves. */
  multiline?: boolean
  /** The value cannot be edited. */
  disabled?: boolean
  /** The size of the display and the field: 28, 35 or 42 px. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** The field's look. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Leaving the field saves it. `true` by default; `false` keeps it open until Enter, ✓, Escape or ×. */
  saveOnBlur?: boolean
  /** Renders the ✓ and × buttons after the field. */
  showButtons?: boolean
  /** Renders the display's content from the value: a badge, an image. */
  renderDisplay?: (value: string) => React.ReactNode
  /** Renders your own editor in place of the Input or Textarea. */
  renderEditor?: (props: InplaceEditorProps) => React.ReactNode
}) {
  const strings = useUiStrings()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const fieldId = React.useId()
  const hintId = React.useId()
  const errorId = React.useId()

  const [valueState, setValueState] = React.useState(defaultValue)
  const value = valueProp ?? valueState
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = !disabled && (openProp ?? openState)
  const [draft, setDraft] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Closed from outside (a controlled `open`): the next opening starts from the value again.
  const [wasOpen, setWasOpen] = React.useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open) {
      setDraft(null)
      setError(null)
      setSaving(false)
    }
  }

  const displayRef = React.useRef<HTMLButtonElement>(null)
  // The open field, as state: it takes focus as soon as it is on the page.
  const [fieldNode, setFieldNode] = React.useState<HTMLElement | null>(null)
  // Whether the closing should give focus back to the display: yes after Enter, Escape, ✓ and ×; not when the person
  // left the field for something else.
  const focusDisplay = React.useRef(false)
  const openedBefore = React.useRef(open)
  // The field and its buttons, for the Escape guard below.
  const groupRef = React.useRef<HTMLDivElement>(null)
  // Whether the inplace is on the page, and which opening of the field a save belongs to: a save that settles after the
  // inplace left the page does nothing, and one that settles after the field was closed from outside does not close or
  // mark the field again (it may have been opened anew).
  const mounted = React.useRef(false)
  const session = React.useRef(0)

  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  React.useEffect(() => {
    if (!fieldNode) return
    fieldNode.focus()
    if (fieldNode instanceof HTMLInputElement || fieldNode instanceof HTMLTextAreaElement) fieldNode.select()
  }, [fieldNode])

  React.useEffect(() => {
    const closed = !open && openedBefore.current
    openedBefore.current = open
    if (closed) session.current += 1
    if (closed && focusDisplay.current) displayRef.current?.focus()
    focusDisplay.current = false
  }, [open])

  // Escape in the field cancels the edit and nothing else. A Radix dialog, sheet or popover listens for Escape on the
  // document before the field sees it and would close itself too; marking the key as handled (`preventDefault`) while
  // the field is open keeps the outer layer open, as the library's comboboxes do.
  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && event.target instanceof Node && groupRef.current?.contains(event.target)) {
        event.preventDefault()
      }
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [open])

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    if (!next) {
      setDraft(null)
      setError(null)
    }
    onOpenChange?.(next)
  }

  const current = draft ?? value

  const close = (returnFocus: boolean) => {
    focusDisplay.current = returnFocus
    setOpen(false)
  }

  const save = (returnFocus: boolean) => {
    if (saving) return
    const next = current
    if (next === value) {
      close(returnFocus)
      return
    }
    const started = session.current
    const commitValue = () => {
      if (valueProp === undefined) setValueState(next)
      onValueChange?.(next)
    }
    const commit = () => {
      commitValue()
      close(returnFocus)
    }
    const fail = (reason: unknown) => {
      setSaving(false)
      setError(reason instanceof Error && reason.message ? reason.message : strings.saveFailed)
    }
    let result: unknown
    try {
      result = onSave?.(next)
    } catch (reason) {
      fail(reason)
      return
    }
    if (!isThenable(result)) {
      commit()
      return
    }
    setSaving(true)
    setError(null)
    result.then(
      () => {
        if (!mounted.current) return
        // Closed from outside while it saved: the value is saved, the field is left as it is now.
        if (session.current !== started) {
          commitValue()
          return
        }
        setSaving(false)
        commit()
      },
      (reason: unknown) => {
        if (!mounted.current || session.current !== started) return
        fail(reason)
      }
    )
  }

  const cancel = (returnFocus: boolean) => {
    if (saving) return
    close(returnFocus)
  }

  if (!open) {
    return (
      <div
        data-slot="inplace"
        data-state="closed"
        className={cn("inline-block max-w-full", className)}
        // The caller's own handlers, which the open group calls before its own.
        {...{ onKeyDown, onBlur }}
        {...props}
      >
        <button
          ref={displayRef}
          type="button"
          data-slot="inplace-display"
          data-size={resolvedSize}
          disabled={disabled}
          aria-describedby={hintId}
          onClick={() => setOpen(true)}
          className={cn(
            // The visual target's inplace display: a borderless field, 6px radius, the hovered-surface fill on hover.
            // A word longer than the line (a URL, an address) breaks anywhere rather than run out of the box.
            "inline-flex w-full max-w-full cursor-pointer items-center gap-2 rounded-md border border-transparent text-start wrap-anywhere text-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent",
            // A multi-line value keeps its line breaks.
            multiline && "whitespace-pre-line",
            displaySizes[resolvedSize]
          )}
        >
          {renderDisplay ? (
            renderDisplay(value)
          ) : value ? (
            value
          ) : (
            <span data-slot="inplace-placeholder" className="text-muted-foreground">
              {placeholder}
            </span>
          )}
        </button>
        <span id={hintId} hidden>
          {fillString(strings.edit, { label })}
        </span>
      </div>
    )
  }

  const fieldProps: InplaceEditorProps["fieldProps"] = {
    ref: setFieldNode,
    id: fieldId,
    "aria-label": label,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    "aria-busy": saving || undefined,
    disabled: false,
  }

  const field = renderEditor ? (
    <CustomEditor
      render={renderEditor}
      value={current}
      onValueChange={setDraft}
      save={() => save(true)}
      cancel={() => cancel(true)}
      fieldProps={fieldProps}
    />
  ) : multiline ? (
    <Textarea
      {...fieldProps}
      ref={setFieldNode}
      size={resolvedSize}
      variant={resolvedVariant}
      value={current}
      placeholder={placeholder}
      readOnly={saving}
      onChange={(event) => setDraft(event.target.value)}
      className={cn("min-w-0 flex-1", showButtons && "relative rounded-e-none focus-visible:z-10")}
    />
  ) : (
    <Input
      {...fieldProps}
      ref={setFieldNode}
      size={resolvedSize}
      variant={resolvedVariant}
      value={current}
      placeholder={placeholder}
      readOnly={saving}
      onChange={(event) => setDraft(event.target.value)}
      className={cn("min-w-0 flex-1", showButtons && "relative rounded-e-none focus-visible:z-10")}
    />
  )

  // The ✓ and × keep focus in the field while the pointer presses them, so pressing them is not a blur that saves.
  const keepFocus = (event: React.MouseEvent) => event.preventDefault()
  const buttonClass = cn(
    // The visual target's inplace buttons: addons of the field, its fill and edge, a green ✓ and a red ×.
    "-ms-px flex shrink-0 cursor-pointer items-center justify-center self-stretch border border-control bg-field transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none focus-visible:z-10 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
    resolvedVariant === "filled" && "bg-field-filled",
    buttonSizes[resolvedSize]
  )

  return (
    <div
      data-slot="inplace"
      data-state="open"
      role="group"
      className={cn("flex max-w-full flex-col gap-1", className)}
      {...props}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key === "Escape") {
          event.preventDefault()
          cancel(true)
        } else if (event.key === "Enter" && !event.nativeEvent.isComposing) {
          const target = event.target
          if (target instanceof HTMLButtonElement) return
          if (target instanceof HTMLTextAreaElement && !(event.ctrlKey || event.metaKey)) return
          event.preventDefault()
          save(true)
        }
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (!saveOnBlur) return
        const next = event.relatedTarget
        if (next instanceof Node && event.currentTarget.contains(next)) return
        // The window lost focus (another tab, another app): the field keeps it, nothing is saved yet.
        if (!next && document.activeElement === event.target) return
        save(false)
      }}
    >
      <div ref={groupRef} data-slot="inplace-editor" className="flex min-w-0 items-stretch">
        {field}
        {showButtons && (
          <>
            <button
              type="button"
              data-slot="inplace-save"
              aria-label={strings.save}
              aria-busy={saving || undefined}
              onMouseDown={keepFocus}
              onClick={() => save(true)}
              className={cn(buttonClass, "text-success hover:bg-success-ghost-hover active:bg-success-ghost-active")}
            >
              {saving ? <Spinner aria-label={strings.saving} /> : <CheckIcon aria-hidden="true" />}
            </button>
            <button
              type="button"
              data-slot="inplace-cancel"
              aria-label={strings.cancel}
              // While a save runs, the × waits for it (as Escape does).
              aria-disabled={saving || undefined}
              onMouseDown={keepFocus}
              onClick={() => cancel(true)}
              className={cn(
                buttonClass,
                "rounded-e-md text-destructive hover:bg-destructive-ghost-hover active:bg-destructive-ghost-active aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
              )}
            >
              <XIcon aria-hidden="true" />
            </button>
          </>
        )}
        {!showButtons && saving && <Spinner aria-label={strings.saving} className="ms-2 self-center" />}
      </div>
      {error && (
        <p id={errorId} data-slot="inplace-error" role="alert" className="text-xs/normal text-destructive-strong">
          {error}
        </p>
      )}
    </div>
  )
}

export { Inplace }
export type { InplaceEditorProps }
