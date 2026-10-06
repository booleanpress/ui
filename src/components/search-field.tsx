// SearchField: built on the library's InputGroup and Input, in a `role="search"` landmark.
"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/input-group"
import { Spinner } from "@/components/spinner"
import { useControlSize, useUiStrings, type ControlSize, type FieldVariant } from "@booleanpress/ui/provider"

/**
 * A search box: a search icon, the text, a clear button while there is text, and an optional spinner. Enter submits
 * the search; Escape clears it, and a second Escape leaves the empty field.
 *
 * @since 0.1.0
 */
function SearchField({
  className,
  size,
  variant,
  loading = false,
  onSearch,
  onKeyDown,
  disabled,
  readOnly,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof InputGroupInput>, "type" | "clearable"> & {
  /** The field's size: 28, 35 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` draws the grey `--field-filled` fill. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Shows a spinner at the end while results load, and marks the field busy. */
  loading?: boolean
  /** Called with the text when the search is submitted with Enter. */
  onSearch?: (value: string) => void
}) {
  const strings = useUiStrings()
  const resolvedSize = useControlSize(size)
  // Without a label of its own, the field (and its search landmark) is named by the provider string `search`.
  const label = ariaLabel ?? (ariaLabelledBy || id ? undefined : strings.search)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === "Enter") {
      // Enter runs the search, never a submission of a form round the field (a settings page that is one form). Enter
      // that confirms text from an input method is left to it.
      if (event.nativeEvent.isComposing) return
      event.preventDefault()
      onSearch?.(event.currentTarget.value)
      return
    }
    if (event.key !== "Escape") return
    const node = event.currentTarget
    if (node.value === "") {
      // Already empty: Escape leaves the field.
      node.blur()
      return
    }
    // Escape empties the field the way typing does, so React and `onChange` see it, and keeps the focus in it. The
    // browser's own clearing of a search field is prevented, so it happens once.
    event.preventDefault()
    if (readOnly) return
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(node, "")
    node.dispatchEvent(new Event("input", { bubbles: true }))
    node.value = ""
  }

  return (
    // A `div`, not a `form`: a form cannot hold a form, and the field must work inside one.
    <div
      role="search"
      data-slot="search-field"
      aria-label={label}
      aria-labelledby={label ? undefined : ariaLabelledBy}
      className={cn("w-full", className)}
    >
      <InputGroup size={resolvedSize} variant={variant} data-disabled={disabled ? "true" : undefined}>
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          ref={ref}
          type="search"
          enterKeyHint="search"
          id={id}
          aria-label={label}
          aria-labelledby={ariaLabelledBy}
          aria-busy={loading || undefined}
          disabled={disabled}
          readOnly={readOnly}
          clearable
          onKeyDown={handleKeyDown}
          // The browser's own clear button and search decoration are hidden: the field draws its own.
          className="[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          {...props}
        />
        {loading ? (
          <InputGroupAddon align="inline-end">
            <Spinner className="text-muted-foreground" />
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </div>
  )
}

export { SearchField }
