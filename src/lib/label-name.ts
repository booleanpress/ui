import * as React from "react"
import { shareNode } from "@/lib/refs"

// Content a label's name leaves out: form controls, hidden content and code.
const SKIPPED = "input, select, textarea, button, meter, progress, output, script, style, template, [hidden], [aria-hidden=true]"

// A label's text as assistive technology reads it: hidden and `aria-hidden` content left out, `aria-label` used. A label
// round the field also leaves out the field itself, and whatever holds it (its buttons, its chips).
function textOf(node: Node, input: HTMLInputElement, root = false): string {
  if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? ""
  if (node.nodeType !== Node.ELEMENT_NODE) return ""
  const element = node as Element
  if (!root && (element.matches(SKIPPED) || element.contains(input))) return ""
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (!root && style && (style.display === "none" || style.visibility === "hidden")) return ""
  const own = root ? null : element.getAttribute("aria-label")?.trim()
  if (own) return ` ${own} `
  const text = Array.from(element.childNodes, (child) => textOf(child, input)).join("")
  // A block inside a label is read as a word of its own.
  return style && style.display !== "" && !style.display.startsWith("inline") ? ` ${text} ` : text
}

// The text of an input's own labels (`<label for>` and a label round it), joined, or undefined when it has none.
function labelsText(input: HTMLInputElement) {
  const text = Array.from(input.labels ?? [], (label) => textOf(label, input, true))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
  return text || undefined
}

/** Keeps a Base UI input's name while its popup is open: `aria-label` from the text of the input's own labels. */
// Base UI hides everything outside the input and the popup from assistive technology while the popup is open
// (`aria-hidden`), the field's visible `<label>` included, and Chrome then reads the input with no name. Given the props
// Base UI renders the input with, this returns the `ref` and `aria-label` to render it with, and `input`, the element;
// no id is written onto the app's labels. An input named by its own `aria-label` or `aria-labelledby` (Base UI's `Field`
// sets one) keeps that name. The text is read on mount and as the popup opens, in the commit that opens it, before Base
// UI's effect hides the label; and again when a label's text changes while the popup is closed.
export function useLabelName({
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-expanded": ariaExpanded,
}: Pick<React.ComponentProps<"input">, "ref" | "aria-label" | "aria-labelledby" | "aria-expanded">) {
  const input = React.useRef<HTMLInputElement | null>(null)
  const [name, setName] = React.useState<string | undefined>(undefined)
  const own = Boolean(ariaLabel || ariaLabelledBy)
  const open = ariaExpanded === true || ariaExpanded === "true"
  const openRef = React.useRef(open)
  const read = React.useRef(false)

  React.useLayoutEffect(() => {
    openRef.current = open
    const node = input.current
    if (own || !node) {
      read.current = false
      setName(undefined)
      return
    }
    // Once open, Base UI has hidden parts of a label round the field: read on mount and on opening only.
    if (open || !read.current) {
      read.current = true
      setName(labelsText(node))
    }
    if (typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(() => {
      if (!openRef.current) setName(labelsText(node))
    })
    for (const label of Array.from(node.labels ?? [])) {
      observer.observe(label, { subtree: true, childList: true, characterData: true })
    }
    return () => observer.disconnect()
  }, [own, open])

  const setRef = React.useCallback(
    (node: HTMLInputElement | null) => (node ? shareNode(node, [input, ref]) : undefined),
    [ref]
  )

  return { input, ref: setRef, "aria-label": ariaLabel || (ariaLabelledBy ? undefined : name) }
}
