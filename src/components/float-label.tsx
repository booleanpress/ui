"use client"
// FloatLabel: built on a plain wrapper round one field and its native label; the label moves with CSS.

import * as React from "react"
import { cva } from "class-variance-authority"
import { useFormReset } from "@/lib/form-reset"
import { cn } from "@/lib/utils"

// The fields whose value it reads: a text field (InputNumber's and InputMask's included), a textarea or a native select.
// A Radix Select is read from its trigger.
const VALUE_FIELD = "input:not([type=checkbox],[type=radio],[type=hidden]), textarea, select:not([aria-hidden=true])"

function readFilled(root: HTMLElement): boolean {
  const trigger = root.querySelector<HTMLElement>("button[role=combobox]")
  if (trigger) return !trigger.hasAttribute("data-placeholder")
  const field = root.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(VALUE_FIELD)
  return field ? field.value !== "" : false
}

/**
 * Keeps `data-filled` on the wrapper while its field has a value: on typing, on a change, on a DOM change (a Radix
 * Select's chosen value, a textarea's new text), after every render (a controlled value set from code) and after a
 * reset of its form (which puts the field back without an input event).
 */
function useFilledAttribute(ref: React.RefObject<HTMLElement | null>) {
  const update = React.useCallback(() => {
    const root = ref.current
    if (root) root.toggleAttribute("data-filled", readFilled(root))
  }, [ref])

  React.useLayoutEffect(() => {
    update()
  })

  useFormReset(ref, update)

  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    root.addEventListener("input", update)
    root.addEventListener("change", update)
    const observer = new MutationObserver(update)
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["value", "data-placeholder"],
    })
    return () => {
      root.removeEventListener("input", update)
      root.removeEventListener("change", update)
      observer.disconnect()
    }
  }, [ref, update])
}

const floatLabelVariants = cva(
  [
    "relative block in-data-[slot=input-group]:flex-1 in-data-[slot=input-group]:self-stretch",
    // Where the label starts and how large it is at rest: the field's start padding and text size, past a leading icon.
    "[--float-label-start:0.625rem] [--float-label-size:0.875rem]",
    "has-[:is(input,textarea,select,[role=combobox])[data-size=sm]]:[--float-label-start:0.5rem] has-[:is(input,textarea,select,[role=combobox])[data-size=sm]]:[--float-label-size:0.75rem]",
    "has-[:is(input,textarea,select,[role=combobox])[data-size=lg]]:[--float-label-start:0.75rem] has-[:is(input,textarea,select,[role=combobox])[data-size=lg]]:[--float-label-size:1rem]",
    "has-[>[data-slot=input-group]>[data-align=inline-start]>svg]:[--float-label-start:2.125rem] has-[>[data-slot=input-group][data-size=sm]>[data-align=inline-start]>svg]:[--float-label-start:1.75rem] has-[>[data-slot=input-group][data-size=lg]>[data-align=inline-start]>svg]:[--float-label-start:2.5rem]",
    // An InputNumber with buttons on both sides: the label starts past the 36px minus button.
    "has-[>[data-slot=input-number][data-buttons=horizontal]]:[--float-label-start:2.875rem] has-[>[data-slot=input-number][data-buttons=horizontal][data-size=sm]]:[--float-label-start:2.75rem] has-[>[data-slot=input-number][data-buttons=horizontal][data-size=lg]]:[--float-label-start:3rem]",
    // The label at rest: inside the empty field, vertically centred (a textarea's at its first line), in the muted colour.
    "[&>label]:pointer-events-none [&>label]:absolute [&>label]:start-(--float-label-start) [&>label]:top-1/2 [&>label]:z-1 [&>label]:-translate-y-1/2 [&>label]:text-(length:--float-label-size) [&>label]:leading-none [&>label]:font-normal [&>label]:text-muted-foreground [&>label]:transition-[top,translate,font-size,color,background-color,padding] [&>label]:duration-(--bui-duration-control) [&>label]:ease-(--bui-ease-standard)",
    "has-[textarea]:[&>label]:top-1.5 has-[textarea]:[&>label]:translate-y-0 has-[textarea[data-size=sm]]:[&>label]:top-1 has-[textarea[data-size=lg]]:[&>label]:top-2",
    // Focus (and an open list) colours the label; invalid colours it red, focused or not.
    "[&:is(:focus-within,:has([role=combobox][data-state=open])):not(:has([aria-invalid=true]))>label]:text-secondary-foreground",
    "has-[[aria-invalid=true]]:[&>label]:text-destructive-strong",
  ],
  {
    variants: {
      variant: {
        // Above the field, 10px.
        over: [
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:top-[-1.125rem]",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:translate-y-0",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:text-[0.625rem]",
        ],
        // Into the top of the field, which grows to 47px to make room; an InputNumber's prefix and suffix move down with
        // its number.
        in: [
          "[&_:is([data-slot=input],[data-slot=input-mask],[data-slot=input-number-input],[data-slot=input-number-prefix],[data-slot=input-number-suffix],[data-slot=textarea],[data-slot=input-group-control],[data-slot=native-select],[data-slot=select-trigger])]:pt-[1.125rem] [&_:is([data-slot=input],[data-slot=input-mask],[data-slot=input-number-input],[data-slot=input-number-prefix],[data-slot=input-number-suffix],[data-slot=textarea],[data-slot=input-group-control],[data-slot=native-select],[data-slot=select-trigger])]:pb-1.5",
          "[&_[data-slot=select-trigger]>svg]:-mt-3",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:top-1.5",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:translate-y-0",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:text-[0.625rem]",
        ],
        // Onto the field's top edge, on the field's fill.
        on: [
          "[&>label]:rounded-[2px]",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:top-0",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:-translate-y-1/2",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:text-[0.625rem]",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:bg-field",
          "[&:is([data-filled],:focus-within,:has(:is(:autofill,input[placeholder],textarea[placeholder],[role=combobox][data-state=open])))>label]:px-0.5",
        ],
      },
    },
    defaultVariants: {
      variant: "over",
    },
  }
)

/**
 * A label that sits inside an empty field, like a placeholder, and moves out of the way when the field has focus or a
 * value: above it (`over`), into its top (`in`) or onto its edge (`on`). Wrap one field and its `<label htmlFor>`: an
 * Input, InputNumber, InputMask, Textarea, PasswordInput, InputGroup, NativeSelect or Select.
 *
 * @since 0.1.0
 */
function FloatLabel({
  className,
  variant = "over",
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  /** Where the label goes when the field has focus or a value: `over` (default), `in` or `on`. */
  variant?: "over" | "in" | "on"
}) {
  const innerRef = React.useRef<HTMLDivElement | null>(null)
  useFilledAttribute(innerRef)

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  return (
    <div
      ref={setRefs}
      data-slot="float-label"
      data-variant={variant}
      className={cn(floatLabelVariants({ variant }), className)}
      {...props}
    />
  )
}

export { FloatLabel }
