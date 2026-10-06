"use client"

import { cn } from "@/lib/utils"

import { useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.0 */
function Spinner({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  const strings = useUiStrings()

  // boolean-ui patch: the BooleanPress spinner — a faint full ring with a round-capped arc a little over a quarter of
  // it, both in the current text colour, 14px like the other icons in a control (stock: lucide's open loader arc, 16px).
  return (
    <svg
      // boolean-ui patch: a `data-slot`, as every other part has, for styles and tests (stock: none).
      data-slot="spinner"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      // boolean-ui patch: the accessible name comes from the provider.
      aria-label={strings.loading}
      className={cn("size-3.5 shrink-0 animate-spin", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="18 100"
      />
    </svg>
  )
}

export { Spinner }
