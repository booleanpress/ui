"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useControlSize,
  useFieldVariant,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

// boolean-ui patch: the clear button's box, icon and place by size. It is a 20, 24 or 26px box round a 12, 14 or 16px ×,
// so the × sits 8, 10 or 12px from the field's end, the field's own padding (stock: no clear button).
const clearButtonSizes: Record<ControlSize, string> = {
  sm: "size-5 [&>svg]:size-3",
  default: "size-6 [&>svg]:size-3.5",
  lg: "size-7 [&>svg]:size-4",
}

// Alone, the button follows the input and is pulled back over the input's end padding, so it stays at the input's end
// whatever width the input is given.
const clearButtonPlaces: Record<ControlSize, string> = {
  sm: "-ms-6 me-1",
  default: "-ms-7.25 me-1.25",
  lg: "-ms-8.5 me-1.5",
}

// In an InputGroup the button is a part of the group after the input: an addon button that follows takes the gap.
const clearButtonGroupPlaces: Record<ControlSize, string> = {
  sm: "-ms-1 me-1 group-has-[>[data-align=inline-end]>button]/input-group:me-0",
  default: "-ms-1.25 me-1.25 group-has-[>[data-align=inline-end]>button]/input-group:me-0",
  lg: "-ms-1.5 me-1.5 group-has-[>[data-align=inline-end]>button]/input-group:me-0",
}

// The input's end padding while it can be cleared, so the text never runs under the ×.
const clearPaddings: Record<ControlSize, string> = {
  sm: "data-[size=sm]:pe-7",
  default: "pe-8.5",
  lg: "data-[size=lg]:pe-10",
}

function hasText(value: unknown) {
  return value != null && String(value) !== ""
}

// boolean-ui patch: `keyFilter` blocks the typed and pasted characters it refuses, on `beforeinput` and `paste`; its number
// presets take the provider locale's separators (stock: no key filter).

/**
 * What `keyFilter` lets into an input: a preset, or a regular expression. A preset or an expression that is not
 * anchored is tested against each character typed or pasted; one written `^…$` against the whole value the edit would
 * leave.
 *
 * @since 0.1.1
 */
type InputKeyFilter = "int" | "num" | "money" | "hex" | "alpha" | "alphanum" | RegExp

const escapeForClass = (text: string) => text.replace(/[\\\]^-]/g, "\\$&")

/** The test a key filter applies: per character, or on the whole next value. Numbers use the locale's separators. */
function keyFilterTest(kind: string, source: string, flags: string, locale: string | undefined) {
  if (kind === "regexp") {
    const pattern = new RegExp(source, flags.replace(/[gy]/g, ""))
    const anchored = source.startsWith("^") && source.endsWith("$") && !source.endsWith("\\$")
    return anchored ? { whole: pattern } : { char: pattern }
  }
  // Number presets take the locale's decimal and grouping separators, so `1.234,5` can be typed in German.
  const parts = new Intl.NumberFormat(locale).formatToParts(11111.1)
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? "."
  const group = parts.find((part) => part.type === "group")?.value ?? ","
  // A space-like group separator (French, Swiss) is typed as a plain space.
  const groupChars = /\s/.test(group) ? `${group} ` : group
  const presets: Record<string, RegExp> = {
    int: /[0-9-]/,
    num: new RegExp(`[0-9\\-${escapeForClass(decimal)}]`),
    money: new RegExp(`[0-9${escapeForClass(decimal + groupChars)}]`),
    hex: /[0-9a-f]/i,
    alpha: /\p{L}/u,
    alphanum: /[\p{L}\p{N}]/u,
  }
  return { char: presets[kind] ?? /[\s\S]/ }
}

/** Blocks typed and pasted text the filter refuses, before the browser inserts it. */
function useKeyFilter(inputRef: React.RefObject<HTMLInputElement | null>, keyFilter: InputKeyFilter | undefined) {
  const { locale } = useUiLocale()
  const kind = keyFilter === undefined ? "" : keyFilter instanceof RegExp ? "regexp" : keyFilter
  const source = keyFilter instanceof RegExp ? keyFilter.source : ""
  const flags = keyFilter instanceof RegExp ? keyFilter.flags : ""

  React.useEffect(() => {
    const node = inputRef.current
    if (!node || !kind) return
    const test = keyFilterTest(kind, source, flags, locale)
    const accepts = (text: string) => {
      if (test.char) return Array.from(text).every((char) => test.char.test(char))
      const start = node.selectionStart ?? node.value.length
      const end = node.selectionEnd ?? start
      return test.whole.test(node.value.slice(0, start) + text + node.value.slice(end))
    }
    const onBeforeInput = (event: InputEvent) => {
      // Text from an input method is still being composed; it cannot be cancelled.
      if (!event.inputType.startsWith("insert") || event.isComposing || event.inputType === "insertCompositionText") return
      const text = event.data ?? event.dataTransfer?.getData("text/plain") ?? ""
      if (text && !accepts(text)) event.preventDefault()
    }
    const onPaste = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text/plain") ?? ""
      if (text && !accepts(text)) event.preventDefault()
    }
    node.addEventListener("beforeinput", onBeforeInput)
    node.addEventListener("paste", onPaste)
    return () => {
      node.removeEventListener("beforeinput", onBeforeInput)
      node.removeEventListener("paste", onPaste)
    }
  }, [inputRef, kind, source, flags, locale])
}

/** @since 0.1.1 */
function Input({
  className,
  type,
  size,
  variant,
  clearable = false,
  keyFilter,
  ref,
  value,
  defaultValue,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  /** The field's size: 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. @since 0.1.1 */
  size?: ControlSize
  /** `filled` draws the grey `--field-filled` fill. Defaults to the provider's `fieldVariant`. @since 0.1.1 */
  variant?: FieldVariant
  /** Shows a button that empties the field while it has a value. @since 0.1.1 */
  clearable?: boolean
  /**
   * Lets only some characters in: `int`, `num`, `money`, `hex`, `alpha`, `alphanum` or a regular expression. Typed and
   * pasted text it refuses is not inserted. @since 0.1.1
   */
  keyFilter?: InputKeyFilter
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const strings = useUiStrings()
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [uncontrolledFilled, setUncontrolledFilled] = React.useState(() => hasText(defaultValue))
  const filled = value !== undefined ? hasText(value) : uncontrolledFilled
  // InputGroupInput renders this input as the group's control; the clear button is then one of the group's parts.
  const inGroup = (props as { "data-slot"?: string })["data-slot"] === "input-group-control"

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  useKeyFilter(inputRef, keyFilter)

  // A form reset puts an uncontrolled input back to its default value without an input event. (Inline rather than
  // `useFormReset`, so the many entries built on Input do not carry that module.)
  React.useEffect(() => {
    const form = inputRef.current?.form
    if (!clearable || value !== undefined || !form) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const onReset = () => {
      // The reset event fires before the form resets, so the value is read once it has.
      clearTimeout(timer)
      timer = setTimeout(() => setUncontrolledFilled(hasText(inputRef.current?.value)))
    }
    form.addEventListener("reset", onReset)
    return () => {
      form.removeEventListener("reset", onReset)
      clearTimeout(timer)
    }
  }, [clearable, value])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setUncontrolledFilled(event.target.value !== "")
    onChange?.(event)
  }

  const clear = () => {
    const node = inputRef.current
    if (!node) return
    // Set the value the way typing does, past React's value tracker, so React sees an input event and calls onChange
    // with the empty value.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(node, "")
    node.dispatchEvent(new Event("input", { bubbles: true }))
    // Then set it once more through the element itself, so anything else that tracks the value (a testing library's
    // simulated typing) sees the field empty too. React has already read the change, so this one is silent.
    node.value = ""
    node.focus()
  }

  const input = (
    <input
      type={type}
      data-slot="input"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      className={cn(
        // boolean-ui patch: the BooleanPress look — 34px tall from 6px × 10px padding and a 20px line, 14px text, a solid
        // `--field` fill, the `--control` edge darkening to `--control-hover` on hover; disabled fills `--field-disabled`
        // at 60% opacity (stock: 36px fixed height, 16px text below md, transparent fill, 50% opacity when disabled).
        "w-full min-w-0 rounded-md border border-control bg-field px-2.5 py-1.5 text-sm text-foreground shadow-(--bui-shadow-field) transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none selection:bg-primary selection:text-primary-foreground file:me-2.5 file:inline-flex file:h-5 file:border-0 file:bg-transparent file:p-0 file:text-sm file:font-medium file:text-foreground placeholder:text-field-placeholder hover:border-control-hover disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-field-disabled disabled:text-field-disabled-foreground disabled:opacity-60",
        // boolean-ui patch: sizes — `sm` 26px from 4px × 8px padding and 12px text, `lg` 42px from 8px × 12px padding and
        // 16px text; the file button's text follows (stock: one size).
        "data-[size=sm]:px-2 data-[size=sm]:py-1 data-[size=sm]:text-xs data-[size=sm]:file:me-2 data-[size=sm]:file:h-4 data-[size=sm]:file:text-xs data-[size=lg]:px-3 data-[size=lg]:py-2 data-[size=lg]:text-base data-[size=lg]:file:me-3 data-[size=lg]:file:h-6 data-[size=lg]:file:text-base",
        // boolean-ui patch: `variant="filled"` fills `--field-filled`, on hover and focus too; disabled keeps its own fill
        // (stock: no variant).
        "data-[variant=filled]:enabled:bg-field-filled",
        // boolean-ui patch: focus turns the edge `--ring`, with no ring around it (stock: a 3px ring at 50%).
        "focus-visible:border-ring",
        // boolean-ui patch: invalid is the `--invalid` edge and a red placeholder, no ring; focus still shows `--ring`
        // (stock: the destructive edge and ring).
        "aria-invalid:border-invalid aria-invalid:placeholder:text-field-invalid-foreground aria-invalid:focus-visible:border-ring",
        clearable && !inGroup && clearPaddings[resolvedSize],
        className
      )}
      ref={clearable || keyFilter ? setRefs : ref}
      value={value}
      defaultValue={defaultValue}
      onChange={clearable ? handleChange : onChange}
      {...props}
    />
  )

  if (!clearable) return input

  const clearButton =
    filled && !props.disabled && !props.readOnly ? (
      <button
        type="button"
        data-slot="input-clear"
        aria-label={strings.clear}
        className={cn(
          // boolean-ui patch: the clear button is a bare × in the field-icon colour, `--foreground` on hover, with the
          // 1px focus outline 2px away (stock: no clear button).
          "flex shrink-0 items-center justify-center rounded-sm text-field-icon transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring",
          clearButtonSizes[resolvedSize],
          inGroup ? clearButtonGroupPlaces[resolvedSize] : clearButtonPlaces[resolvedSize]
        )}
        // Keep the focus in the field while the pointer presses the button.
        onMouseDown={(event) => event.preventDefault()}
        onClick={clear}
      >
        <XIcon aria-hidden="true" />
      </button>
    ) : null

  if (inGroup) {
    return (
      <>
        {input}
        {clearButton}
      </>
    )
  }

  return (
    // boolean-ui patch: a clearable input is wrapped with its clear button (stock: no clear button).
    <div data-slot="input-wrapper" className="flex w-full min-w-0 items-center">
      {input}
      {clearButton}
    </div>
  )
}

export { Input }
export type { InputKeyFilter }
