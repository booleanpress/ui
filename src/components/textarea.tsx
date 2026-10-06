"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  useControlSize,
  useFieldVariant,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

/** @since 0.1.1 */
function Textarea({
  className,
  size,
  variant,
  autoResize = false,
  fluid = false,
  ref,
  onInput,
  style,
  ...props
}: React.ComponentProps<"textarea"> & {
  /** The text size and padding: 12, 14 or 16 px text. Defaults to the provider's `controlSize`. @since 0.1.1 */
  size?: ControlSize
  /** `filled` draws the grey `--field-filled` fill. Defaults to the provider's `fieldVariant`. @since 0.1.1 */
  variant?: FieldVariant
  /** Grows with its content. Fixed-height by default. @since 0.1.1 */
  autoResize?: boolean
  /** Fills its container. Uses its native column width by default. @since 0.1.1 */
  fluid?: boolean
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  React.useImperativeHandle(ref, () => textareaRef.current!, [])
  // boolean-ui patch: grow from the native rows height, without changing the column width or relying on field-sizing.
  const initialHeight = style?.height
  const resize = React.useCallback(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = initialHeight == null ? "" : typeof initialHeight === "number" ? `${initialHeight}px` : initialHeight
    if (!autoResize) return
    const minimum = node.offsetHeight
    const border = node.offsetHeight - node.clientHeight
    node.style.height = `${Math.max(minimum, node.scrollHeight + border)}px`
  }, [autoResize, initialHeight])
  React.useLayoutEffect(resize)
  React.useEffect(() => {
    const node = textareaRef.current
    if (!autoResize || !node) return
    const reset = () => queueMicrotask(resize)
    const form = node.form
    form?.addEventListener("reset", reset)
    let width = node.clientWidth
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(() => {
      if (node.clientWidth === width) return
      width = node.clientWidth
      resize()
    })
    observer?.observe(node)
    return () => {
      form?.removeEventListener("reset", reset)
      observer?.disconnect()
    }
  }, [autoResize, resize])

  return (
    <textarea
      data-slot="textarea"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      data-auto-resize={autoResize || undefined}
      data-fluid={fluid || undefined}
      className={cn(
        // boolean-ui patch: the BooleanPress look, as Input — 6px × 10px padding, 14px text on a 20px line, a solid
        // `--field` fill, the `--control` edge darkening on hover, `--ring` edge on focus with no ring, `--invalid` edge,
        // disabled fills `--field-disabled` (stock: 8px × 12px padding, transparent fill, a 3px ring, 50% opacity).
        "inline-block rounded-md border border-control bg-field px-2.5 py-1.5 text-sm text-foreground shadow-(--bui-shadow-field) transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none placeholder:text-field-placeholder hover:border-control-hover focus-visible:border-ring disabled:cursor-not-allowed disabled:border-control disabled:bg-field-disabled disabled:text-field-disabled-foreground aria-invalid:border-invalid aria-invalid:placeholder:text-field-invalid-foreground aria-invalid:focus-visible:border-ring",
        // boolean-ui patch: sizes, as Input — `sm` 4px × 8px padding and 12px text, `lg` 8px × 12px padding and 16px text
        // (stock: one size).
        "data-[size=sm]:px-2 data-[size=sm]:py-1 data-[size=sm]:text-xs data-[size=lg]:px-3 data-[size=lg]:py-2 data-[size=lg]:text-base",
        // boolean-ui patch: `variant="filled"` fills `--field-filled`, on hover and focus too; disabled keeps its own fill
        // (stock: no variant).
        "data-[variant=filled]:enabled:bg-field-filled",
        // boolean-ui patch: native fixed rows and column width unless growth or fluid width is requested.
        autoResize && "resize-none overflow-y-auto",
        fluid && "w-full",
        className
      )}
      {...props}
      ref={textareaRef}
      style={style}
      onInput={(event) => {
        resize()
        onInput?.(event)
      }}
    />
  )
}

export { Textarea }
