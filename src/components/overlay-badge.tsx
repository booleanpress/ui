"use client"

// OverlayBadge: a Badge pinned to the top-end corner of an icon, a button or an avatar; built on Badge, no primitive.

import * as React from "react"
import { cn } from "@/lib/utils"

import { Badge, type BadgeProps } from "@/components/badge"

/** What can take focus; a focusable child gets the label as its description instead of the label being read beside it. */
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

/** @since 0.1.1 */
function OverlayBadge({
  className,
  children,
  label,
  count,
  max,
  dot = false,
  severity,
  size,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> &
  Pick<BadgeProps, "count" | "max" | "severity" | "size"> & {
    /** One element: an icon, a button or an avatar. */
    children: React.ReactElement<{ "aria-describedby"?: string }>
    /**
     * The badge in words, such as "3 unread messages". A focusable child is described by it; any other child has it
     * read after it. The badge itself is hidden from assistive technology.
     */
    label: string
    /** An 8px dot instead of a count. */
    dot?: boolean
  }) {
  const labelId = React.useId()
  const rootRef = React.useRef<HTMLSpanElement>(null)
  const [describes, setDescribes] = React.useState(false)

  // Whether the child takes focus is known only once it is in the page; until then the label is read beside it.
  React.useEffect(() => {
    const child = rootRef.current?.firstElementChild
    setDescribes(Boolean(child?.matches(FOCUSABLE)))
  }, [children])

  const child = React.Children.only(children)
  // Only a focusable child is described by the label; any other child has it read after it, so it is not read twice
  // (once as the description of an image, once as the text beside it).
  const describedBy =
    [child.props["aria-describedby"], label && describes ? labelId : undefined].filter(Boolean).join(" ") || undefined

  return (
    <span
      ref={rootRef}
      data-slot="overlay-badge"
      className={cn("relative inline-flex w-fit shrink-0", className)}
      {...props}
    >
      {React.cloneElement(child, { "aria-describedby": describedBy })}
      {/* `max-w-none`: a badge caps itself at its container's width, and here the container is the icon it sits on. */}
      <Badge
        aria-hidden
        dot={dot}
        count={dot ? undefined : count}
        max={max}
        severity={severity}
        size={size}
        data-slot="overlay-badge-badge"
        className="pointer-events-none absolute end-0 top-0 max-w-none origin-top-right translate-x-1/2 -translate-y-1/2 outline-2 outline-card outline-solid rtl:origin-top-left rtl:-translate-x-1/2"
      />
      {label ? (
        <span id={labelId} data-slot="overlay-badge-label" className="sr-only" hidden={describes}>
          {label}
        </span>
      ) : null}
    </span>
  )
}

export { OverlayBadge }
