"use client"

// CopyButton: built on Button and Tooltip. Copies a value with the Clipboard API (a hidden text area and the copy command
// where that API is missing or refused), then shows a check and says "Copied" for two seconds, on screen and in a polite
// live region.

import * as React from "react"
import { CheckIcon, CopyIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip"
import { useControlSize, useUiStrings, type ControlSize } from "@booleanpress/ui/provider"

type CopyState = "idle" | "copied" | "failed"

const ICON_SIZES = { xs: "icon-xs", sm: "icon-sm", default: "icon", lg: "icon-lg" } as const

/**
 * Copies through a selected, off-screen text area: the way that works where the Clipboard API does not. The text area
 * goes into `container` (beside the button), so a dialog's focus trap does not pull focus back out of it.
 */
function copyWithSelection(text: string, container?: HTMLElement | null): boolean {
  if (typeof document === "undefined") return false
  const focused = document.activeElement as HTMLElement | null
  const area = document.createElement("textarea")
  area.value = text
  area.setAttribute("readonly", "")
  area.setAttribute("aria-hidden", "true")
  area.style.position = "fixed"
  area.style.top = "0"
  area.style.opacity = "0"
  area.style.pointerEvents = "none"
  const host = container ?? document.body
  host.appendChild(area)
  area.focus({ preventScroll: true })
  area.select()
  let copied: boolean
  try {
    copied = document.execCommand("copy")
  } catch {
    copied = false
  }
  area.remove()
  focused?.focus({ preventScroll: true })
  return copied
}

/**
 * Writes `text` to the clipboard: the Clipboard API first, then the selection fallback. Resolves `true` when it worked.
 * `container` is where the fallback puts its hidden text area: an element inside the open dialog, when there is one
 * (the page's body by default).
 *
 * @since 0.1.1
 */
async function copyText(text: string, container?: HTMLElement | null): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Refused (no permission, an insecure page, a frame without the clipboard feature): try the fallback.
  }
  return copyWithSelection(text, container)
}

/** @since 0.1.1 */
function CopyButton({
  className,
  value,
  getValue,
  timeout = 2000,
  onCopy,
  onCopyError,
  showLabel = false,
  label,
  size,
  variant,
  tooltip = true,
  tooltipSide = "top",
  onClick,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "children" | "value" | "asChild" | "aria-label" | "onCopy"> & {
  /** The text to copy. */
  value?: string
  /** Returns the text to copy at the moment of the click, for a value that is not known while rendering. Wins over `value`. */
  getValue?: () => string | Promise<string>
  /** Milliseconds the check and "Copied" stay. 2000 by default. */
  timeout?: number
  /** Called with the copied text once it is on the clipboard. */
  onCopy?: (text: string) => void
  /** Called when neither the Clipboard API nor the fallback could copy. */
  onCopyError?: (error: unknown) => void
  /** Shows "Copy" (then "Copied") beside the icon instead of the icon alone. */
  showLabel?: boolean
  /** The icon-only button's accessible name, naming what it copies ("Copy API key"). The provider's `copy` string by default. */
  label?: string
  /** `xs` 24 px, `sm` 28 px, `default`, `lg` 42 px. The provider's `controlSize` when left out. */
  size?: "xs" | ControlSize
  /** The icon-only button's tooltip: "Copy", then "Copied". `true` by default. */
  tooltip?: boolean
  /** The tooltip's side: `top` (default), `right`, `bottom` or `left`. */
  tooltipSide?: "top" | "right" | "bottom" | "left"
}) {
  const strings = useUiStrings()
  const control = useControlSize(size === "xs" ? undefined : size)
  const resolved = size === "xs" ? "xs" : control
  const [state, setState] = React.useState<CopyState>("idle")
  const [hovered, setHovered] = React.useState(false)
  const [message, setMessage] = React.useState("")
  // Escape closes the "Copied" tooltip before its time is up.
  const [dismissed, setDismissed] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  const mounted = React.useRef(false)

  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      window.clearTimeout(timer.current)
    }
  }, [])

  const settle = (next: CopyState) => {
    // A copy that ends after the button has gone changes nothing and leaves no timer behind.
    if (!mounted.current) return
    setState(next)
    setDismissed(false)
    // The live region is emptied when the check goes, so the next copy is announced again.
    setMessage(next === "copied" ? strings.copied : strings.copyFailed)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setState("idle")
      setMessage("")
    }, timeout)
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    // Read before the first await: React clears `currentTarget` once the event has been handled.
    const container = event.currentTarget.parentElement
    try {
      const text = getValue ? await getValue() : (value ?? "")
      if (await copyText(text, container)) {
        settle("copied")
        onCopy?.(text)
      } else {
        settle("failed")
        onCopyError?.(new Error("Copy failed"))
      }
    } catch (error) {
      settle("failed")
      onCopyError?.(error)
    }
  }

  const icon = state === "copied" ? <CheckIcon aria-hidden="true" /> : state === "failed" ? <XIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />
  const said = state === "copied" ? strings.copied : state === "failed" ? strings.copyFailed : strings.copy

  const button = (
    <Button
      data-slot="copy-button"
      data-state={state}
      type="button"
      variant={variant ?? (showLabel ? "outline" : "ghost")}
      size={showLabel ? resolved : ICON_SIZES[resolved]}
      // The name stays put while the state changes: the live region says what happened.
      aria-label={showLabel ? undefined : (label ?? strings.copy)}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        // The visual target's icon sizes: 12 px in `xs` and `sm`, 14 px by default, 16 px in `lg`.
        resolved === "sm" && "[&_svg:not([class*='size-'])]:size-3",
        resolved === "lg" && "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {icon}
      {showLabel ? <span data-slot="copy-button-label">{said}</span> : null}
    </Button>
  )

  return (
    <>
      {showLabel || !tooltip ? (
        button
      ) : (
        // The tooltip says "Copy" on hover and focus, and stays open with "Copied" for as long as the check shows.
        <Tooltip open={(state !== "idle" && !dismissed) || hovered} onOpenChange={setHovered}>
          {/* The tooltip repeats or follows the name, so it is not added as a description too. */}
          <TooltipTrigger asChild aria-describedby={props["aria-describedby"]}>
            {button}
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} onEscapeKeyDown={() => setDismissed(true)}>
            {said}
          </TooltipContent>
        </Tooltip>
      )}
      {/* An `<output>` (a status region) rather than a span: it reads as one, is valid inside a paragraph, and is not
          taken for a text add-on by InputGroup. */}
      <output data-slot="copy-button-status" aria-live="polite" className="sr-only">
        {message}
      </output>
    </>
  )
}

export { CopyButton, copyText }
