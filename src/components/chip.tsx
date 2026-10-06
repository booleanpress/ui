"use client"

// Chip: a compact label with an optional icon or image and an optional remove button; plain elements, no primitive.

import * as React from "react"
import { CircleXIcon } from "lucide-react"
import { cn, fillString } from "@/lib/utils"

import { useUiStrings } from "@booleanpress/ui/provider"

const ChipGroupContext = React.createContext(false)

/** @since 0.1.0 */
function ChipGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ChipGroupContext.Provider value={true}>
      <div
        role="list"
        // Focus lands here when the last removable chip is removed, so it is not lost to the page.
        tabIndex={-1}
        data-slot="chip-group"
        className={cn("flex flex-wrap items-center gap-2 outline-none", className)}
        {...props}
      />
    </ChipGroupContext.Provider>
  )
}

/** @since 0.1.0 */
function Chip({
  className,
  label,
  icon,
  image,
  imageAlt = "",
  onRemove,
  disabled = false,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The chip's text; the remove button is named after it. */
  label: string
  /** An icon before the label, drawn at 14px. */
  icon?: React.ReactNode
  /** The address of a round image before the label, such as a person's photo. */
  image?: string
  /** The image's text alternative; empty (decorative) by default, as the label names the chip. */
  imageAlt?: string
  /** Shows a remove button, named "Remove {label}", which calls this; Backspace and Delete on it call it too. */
  onRemove?: () => void
  /** Dims the chip and disables its remove button. */
  disabled?: boolean
}) {
  const inGroup = React.useContext(ChipGroupContext)
  const strings = useUiStrings()
  const removable = onRemove !== undefined

  function remove(button: HTMLButtonElement) {
    // Focus moves to the next chip's remove button, else the previous one's, else the group.
    const chip = button.closest('[data-slot="chip"]')
    const scope = chip?.closest<HTMLElement>('[data-slot="chip-group"]') ?? chip?.parentElement ?? null
    const buttons = scope
      ? Array.from(scope.querySelectorAll<HTMLButtonElement>('[data-slot="chip-remove"]:not(:disabled)'))
      : []
    const index = buttons.indexOf(button)
    const target = buttons[index + 1] ?? buttons[index - 1]
    onRemove?.()
    if (target) target.focus()
    else if (scope?.matches('[data-slot="chip-group"]')) scope.focus()
  }

  return (
    <div
      role={inGroup ? "listitem" : undefined}
      data-slot="chip"
      data-removable={removable || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "inline-flex h-7 w-fit max-w-full shrink-0 items-center gap-1.5 rounded-2xl bg-secondary px-2.5 text-xs/normal font-normal text-accent-foreground transition-[background-color] duration-(--bui-duration-control) has-data-[slot=chip-icon]:ps-1.5 has-data-[slot=chip-image]:ps-1.5 has-[[data-slot=chip-remove]:focus-visible]:bg-secondary-hover data-disabled:opacity-70 data-removable:pe-1.5",
        className
      )}
      {...props}
    >
      {image ? (
        <img data-slot="chip-image" src={image} alt={imageAlt} className="-ms-[3px] size-5.5 shrink-0 rounded-full object-cover" />
      ) : icon ? (
        <span
          data-slot="chip-icon"
          aria-hidden
          className="-ms-[3px] flex size-5.5 shrink-0 items-center justify-center [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3.5"
        >
          {icon}
        </span>
      ) : null}
      <span data-slot="chip-label" className="truncate">
        {label}
      </span>
      {removable ? (
        <button
          type="button"
          data-slot="chip-remove"
          aria-label={fillString(strings.removeItem, { label })}
          disabled={disabled}
          onClick={(event) => remove(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" || event.key === "Delete") {
              event.preventDefault()
              remove(event.currentTarget)
            }
          }}
          className={cn(
            "relative -ms-[3px] inline-flex size-5.5 shrink-0 cursor-pointer items-center justify-center rounded-full text-accent-foreground outline-none focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none [&>svg]:size-3.5",
            // A transparent 24px square centred on the button takes its presses, so the target meets WCAG 2.2's 24 × 24
            // minimum (2.5.8) at every chip size while the circle drawn stays 22px (16px in a small tags input).
            "after:absolute after:top-1/2 after:left-1/2 after:size-6 after:-translate-1/2"
          )}
        >
          <CircleXIcon aria-hidden />
        </button>
      ) : null}
    </div>
  )
}

export { Chip, ChipGroup }
