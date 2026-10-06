import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { cn } from "@booleanpress/ui/utils"

/** The 32px icon buttons in an example's toolbar. */
export const toolbarButton =
  "size-8 rounded-md p-0 text-muted-foreground hover:bg-secondary hover:text-[var(--docs-heading)] [&_svg]:size-3.5"

/** Copies the code; says "Copied" for two seconds, on screen and to screen readers. */
export function CopyButton({ code, label = "Copy code", className }: { code: string; label?: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const area = document.createElement("textarea")
      area.value = code
      document.body.append(area)
      area.select()
      document.execCommand("copy")
      area.remove()
    }
    setCopied(true)
  }

  return (
    <span className="flex items-center gap-1.5">
      <span role="status" className="text-xs text-muted-foreground">
        {copied ? "Copied" : ""}
      </span>
      <Button
        variant="ghost"
        className={cn(toolbarButton, className)}
        aria-label={label}
        onClick={copy}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </span>
  )
}
