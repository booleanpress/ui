// InputMask: a small mask engine on the library's Input; the field keeps a pattern's fixed characters and fills its slots.
"use client"

import * as React from "react"

import { Input } from "@/components/input"
import { useFormReset } from "@/lib/form-reset"
import { cn } from "@/lib/utils"

// The slot characters a pattern may use: `9` a digit, `a` a letter, `*` a letter or a digit.
const SLOT_TESTS: Record<string, RegExp> = {
  "9": /[0-9]/,
  a: /[A-Za-z]/,
  "*": /[A-Za-z0-9]/,
}

type CompiledMask = {
  /** One entry per position of the field: the slot's test, or null for a fixed character. */
  tests: (RegExp | null)[]
  /** The fixed character at each position ("" for a slot). */
  literals: string[]
  /** The display position of each slot, in order. */
  slots: number[]
  /** How many slots must be filled for the value to be complete: those before `?`. */
  required: number
}

function compileMask(pattern: string): CompiledMask {
  const tests: (RegExp | null)[] = []
  const literals: string[] = []
  const slots: number[] = []
  let required = -1
  for (const char of pattern) {
    if (char === "?") {
      if (required < 0) required = slots.length
      continue
    }
    const test = SLOT_TESTS[char] ?? null
    if (test) slots.push(tests.length)
    tests.push(test)
    literals.push(test ? "" : char)
  }
  return { tests, literals, slots, required: required < 0 ? slots.length : required }
}

/** The character an empty slot shows: `slotChar`'s character at that position, or its first one. */
function slotPlaceholder(slotChar: string, position: number) {
  const chars = Array.from(slotChar || "_")
  return position < chars.length ? chars[position] : chars[0]
}

/** The slot's test, by slot index. */
function slotTest(mask: CompiledMask, slot: number) {
  return mask.tests[mask.slots[slot]] as RegExp
}

/** The number of slots before a display position, so the index in the raw value a caret there points at. */
function slotIndexAt(mask: CompiledMask, position: number) {
  let count = 0
  for (const slot of mask.slots) {
    if (slot < position) count++
    else break
  }
  return count
}

/** The display position of a slot, or the end of the field past the last one. */
function slotPosition(mask: CompiledMask, slot: number) {
  return slot < mask.slots.length ? mask.slots[slot] : mask.tests.length
}

/** Keeps the leading characters that still fit their slots, so a shift never puts a letter in a digit slot. */
function fitRaw(mask: CompiledMask, raw: string) {
  const chars = Array.from(raw).slice(0, mask.slots.length)
  let fitted = ""
  for (let index = 0; index < chars.length; index++) {
    if (!slotTest(mask, index).test(chars[index])) break
    fitted += chars[index]
  }
  return fitted
}

/** Reads the raw value out of any text, skipping fixed characters and anything that fits no slot, as typing does. */
function parseText(mask: CompiledMask, text: string) {
  const chars = Array.from(text)
  let raw = ""
  let index = 0
  for (const char of chars) {
    if (index >= mask.slots.length) break
    if (slotTest(mask, index).test(char)) {
      raw += char
      index++
    }
  }
  return raw
}

/**
 * The text the field shows for a raw value: `edit` draws every slot (the empty ones in `slotChar`), `rest` stops after
 * the last filled slot once the required part is complete.
 */
function formatRaw(mask: CompiledMask, slotChar: string, raw: string, mode: "edit" | "rest") {
  if (raw === "") return ""
  const chars = Array.from(raw)
  const complete = chars.length >= mask.required
  const end = mode === "rest" && complete ? mask.slots[chars.length - 1] + 1 : mask.tests.length
  let text = ""
  let slot = 0
  for (let position = 0; position < end; position++) {
    if (mask.tests[position]) {
      text += slot < chars.length ? chars[slot] : slotPlaceholder(slotChar, position)
      slot++
    } else {
      text += mask.literals[position]
    }
  }
  return text
}

/** Inserts text at a slot, skipping characters that do not fit. Returns null when nothing fits. */
function insertAt(mask: CompiledMask, raw: string, slot: number, text: string) {
  let chars = Array.from(raw)
  let index = Math.min(slot, chars.length)
  let inserted = false
  for (const char of text) {
    if (index >= mask.slots.length) break
    if (!slotTest(mask, index).test(char)) continue
    chars = [...chars.slice(0, index), char, ...chars.slice(index)]
    index++
    inserted = true
  }
  if (!inserted) return null
  return { raw: fitRaw(mask, chars.join("")), slot: index }
}

/** Removes the slots from `start` up to, not including, `end`, and moves the rest back. */
function removeSlots(mask: CompiledMask, raw: string, start: number, end: number) {
  const chars = Array.from(raw)
  return fitRaw(mask, [...chars.slice(0, start), ...chars.slice(end)].join(""))
}

function setRefs<T>(node: T, ...refs: (React.Ref<T> | undefined)[]) {
  for (const ref of refs) {
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }
}

type MaskState = { raw: string; display: string }

/**
 * A text field that keeps a pattern: `(999) 999-9999` keeps the brackets, space and dash and fills the nines with
 * digits as they are typed. `9` takes a digit, `a` a letter, `*` either; `?` starts the optional part.
 *
 * @since 0.1.0
 */
function InputMask({
  mask: pattern,
  className,
  slotChar = "_",
  autoClear = true,
  unmask = false,
  value,
  defaultValue,
  onValueChange,
  onChange,
  onFocus,
  onBlur,
  inputMode,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "defaultValue" | "keyFilter"> & {
  /** The pattern: `9` a digit, `a` a letter, `*` a letter or a digit, `?` starts the optional part; anything else is fixed. */
  mask: string
  /** What an empty slot shows: one character for every slot, or a string as long as the pattern (`mm/dd/yyyy`). */
  slotChar?: string
  /** Empties the field when it loses focus with the required part unfinished. */
  autoClear?: boolean
  /** `value`, `defaultValue` and `onValueChange` carry the typed characters only (`5551234567`), not the mask. */
  unmask?: boolean
  /** The value, as the field shows it, or the typed characters only with `unmask`. */
  value?: string
  /** The starting value of an uncontrolled field, in the same form as `value`. */
  defaultValue?: string
  /** Called with the new value on every change, and whether the required part is filled. */
  onValueChange?: (value: string, details: { complete: boolean }) => void
}) {
  const mask = React.useMemo(() => compileMask(pattern), [pattern])
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const pendingRef = React.useRef<MaskState | null>(null)
  const pendingCaretRef = React.useRef<number | null>(null)

  const fromValue = React.useCallback(
    (text: string | undefined, mode: "edit" | "rest"): MaskState => {
      const raw = parseText(mask, text ?? "")
      return { raw, display: formatRaw(mask, slotChar, raw, mode) }
    },
    [mask, slotChar]
  )

  const [state, setState] = React.useState<MaskState>(() => fromValue(value ?? defaultValue, "rest"))
  const emitted = (next: MaskState) => (unmask ? next.raw : next.display)

  // A value set from outside (not the one this field reported) replaces the field's text.
  let incoming = state
  const [prevValue, setPrevValue] = React.useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    if (value !== undefined && value !== emitted(state)) {
      incoming = fromValue(value, "rest")
      setState(incoming)
    }
  }

  // A new pattern or slot character redraws the typed characters that still fit it.
  const [prevLook, setPrevLook] = React.useState({ mask, slotChar })
  if (prevLook.mask !== mask || prevLook.slotChar !== slotChar) {
    setPrevLook({ mask, slotChar })
    const raw = fitRaw(mask, incoming.raw)
    setState({ raw, display: formatRaw(mask, slotChar, raw, "rest") })
  }

  // A form reset cannot reach the text, which this field holds in state: put the default value back itself.
  useFormReset(inputRef, () => setState(fromValue(defaultValue, "rest")), {
    enabled: value === undefined,
    form: props.form,
  })

  // The latest state and settings for the native listeners, which are attached once.
  const latestRef = React.useRef({ state, mask, slotChar })
  React.useLayoutEffect(() => {
    latestRef.current = { state, mask, slotChar }
  })

  // The caret goes where the edit left it once React has written the new text.
  React.useLayoutEffect(() => {
    const caret = pendingCaretRef.current
    const node = inputRef.current
    if (caret == null || !node || node.ownerDocument.activeElement !== node) return
    pendingCaretRef.current = null
    node.setSelectionRange(caret, caret)
  })

  /** Writes a new text the way typing does, so React and the app's `onChange` see an input event. */
  const commit = React.useCallback((next: MaskState, caret: number | null) => {
    const node = inputRef.current
    if (!node) return
    pendingRef.current = next
    pendingCaretRef.current = caret
    if (node.value !== next.display) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(node, next.display)
      node.dispatchEvent(new Event("input", { bubbles: true }))
      // Set once more through the element, so anything else that tracks the value (a testing library's simulated typing)
      // sees it too; React has already read the change.
      node.value = next.display
    } else {
      pendingRef.current = null
      setState(next)
    }
    if (caret != null && node.ownerDocument.activeElement === node) node.setSelectionRange(caret, caret)
  }, [])

  // Every edit goes through `beforeinput`: the browser's own edit is cancelled and the mask's applied instead.
  React.useEffect(() => {
    const node = inputRef.current
    if (!node) return

    const insert = (text: string) => {
      const { state: current, mask: compiled, slotChar: slots } = latestRef.current
      const start = node.selectionStart ?? current.display.length
      const end = node.selectionEnd ?? start
      const from = slotIndexAt(compiled, start)
      const to = slotIndexAt(compiled, end)
      const base = end > start ? removeSlots(compiled, current.raw, from, to) : current.raw
      const result = insertAt(compiled, base, from, text)
      if (!result) return
      commit(
        { raw: result.raw, display: formatRaw(compiled, slots, result.raw, "edit") },
        slotPosition(compiled, result.slot)
      )
    }

    const remove = (direction: "backward" | "forward") => {
      const { state: current, mask: compiled, slotChar: slots } = latestRef.current
      const start = node.selectionStart ?? current.display.length
      const end = node.selectionEnd ?? start
      let from: number
      let to: number
      if (end > start) {
        from = slotIndexAt(compiled, start)
        to = slotIndexAt(compiled, end)
      } else if (direction === "backward") {
        from = Math.min(slotIndexAt(compiled, start), current.raw.length) - 1
        to = from + 1
      } else {
        from = slotIndexAt(compiled, start)
        to = from + 1
      }
      if (from < 0 || from >= current.raw.length) return
      const raw = removeSlots(compiled, current.raw, from, to)
      commit({ raw, display: formatRaw(compiled, slots, raw, "edit") }, raw === "" ? 0 : slotPosition(compiled, from))
    }

    const onBeforeInput = (event: InputEvent) => {
      const type = event.inputType
      // Text from an input method is composed first and read on the input event that follows.
      if (event.isComposing || type === "insertCompositionText") return
      if (type.startsWith("insert")) {
        event.preventDefault()
        insert(event.data ?? event.dataTransfer?.getData("text/plain") ?? "")
      } else if (type.startsWith("delete")) {
        event.preventDefault()
        remove(type.endsWith("Forward") ? "forward" : "backward")
      } else if (type === "historyUndo" || type === "historyRedo") {
        event.preventDefault()
      }
    }

    const onPaste = (event: ClipboardEvent) => {
      event.preventDefault()
      insert(event.clipboardData?.getData("text/plain") ?? "")
    }

    node.addEventListener("beforeinput", onBeforeInput)
    node.addEventListener("paste", onPaste)
    return () => {
      node.removeEventListener("beforeinput", onBeforeInput)
      node.removeEventListener("paste", onPaste)
    }
  }, [commit])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pending = pendingRef.current
    pendingRef.current = null
    // The mask's own edit, or text that came another way (autofill, an input method, the clear button): read it again.
    const focused = event.target.ownerDocument.activeElement === event.target
    const next =
      pending && pending.display === event.target.value ? pending : fromValue(event.target.value, focused ? "edit" : "rest")
    setState(next)
    onChange?.(event)
    onValueChange?.(emitted(next), { complete: next.raw.length >= mask.required })
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(event)
    const node = event.currentTarget
    const filled = state.raw.length
    if (filled === 0 || filled >= mask.slots.length) return
    // A click puts the caret where it lands; an unfinished value continues at its first empty slot.
    const position = slotPosition(mask, filled)
    setTimeout(() => {
      if (node.ownerDocument.activeElement === node && (node.selectionStart ?? 0) > position) {
        node.setSelectionRange(position, position)
      }
    })
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const raw = state.raw
    const complete = raw.length >= mask.required
    const next: MaskState = complete ? fromValue(raw, "rest") : autoClear ? { raw: "", display: "" } : state
    if (next.display !== state.display) commit(next, null)
    onBlur?.(event)
  }

  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      setRefs(node, ref)
    },
    [ref]
  )

  return (
    <Input
      ref={mergedRef}
      data-slot="input-mask"
      data-mask={pattern}
      inputMode={inputMode ?? (mask.slots.every((position) => mask.tests[position] === SLOT_TESTS["9"]) ? "numeric" : undefined)}
      // A pattern's slots take Latin letters and digits, so its text reads left to right on every page: on a
      // right-to-left page the brackets and dashes keep their order, while the text stays at the field's start.
      className={cn("[unicode-bidi:plaintext] rtl:text-right", className)}
      value={state.display}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  )
}

export { InputMask }
