import type * as React from "react"

/** Hands an element to several refs from one ref callback; returns the cleanup that lets them all go (React 19). */
export function shareNode<T>(node: T, refs: (React.Ref<T> | undefined)[]) {
  const cleanups = refs.map((ref) => {
    if (typeof ref === "function") {
      const cleanup = ref(node)
      return typeof cleanup === "function" ? cleanup : () => void ref(null)
    }
    if (!ref) return undefined
    ref.current = node
    return () => {
      ref.current = null
    }
  })
  return () => cleanups.forEach((cleanup) => cleanup?.())
}
