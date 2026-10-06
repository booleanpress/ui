import * as React from "react"

/**
 * Calls `onReset` once the form holding `ref`'s element has been reset, which puts native fields back without an input
 * event. `enabled: false` stops it (a controlled field); `form` is the form's id for a field tied to it by attribute.
 *
 * @since 0.1.0
 */
export function useFormReset(
  ref: React.RefObject<Element | null>,
  onReset: () => void,
  { enabled = true, form }: { enabled?: boolean; form?: string } = {}
) {
  const latest = React.useRef(onReset)
  React.useEffect(() => {
    latest.current = onReset
  })

  React.useEffect(() => {
    const node = ref.current
    if (!enabled || !node) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const handleReset = (event: Event) => {
      const target = event.target as Element | null
      // Read the element again: a field that starts again on a reset is a new element.
      const current = ref.current
      if (target?.nodeName !== "FORM" || !current) return
      if (form ? target.id !== form : !target.contains(current)) return
      // The event comes before the form puts its fields back: wait a task, and skip a cancelled reset.
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (!event.defaultPrevented) latest.current()
      })
    }
    const doc = node.ownerDocument
    doc.addEventListener("reset", handleReset)
    return () => {
      doc.removeEventListener("reset", handleReset)
      clearTimeout(timer)
    }
  }, [ref, enabled, form])
}
