import { useEffect, useRef, useState } from "react"
import { InfoIcon, XIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"

export default function AlertDismissible() {
  const [open, setOpen] = useState(true)
  const toggled = useRef(false)
  const button = useRef<HTMLButtonElement>(null)

  // The button that was pressed is gone: focus the one that takes its place.
  useEffect(() => {
    if (toggled.current) button.current?.focus()
  }, [open])

  const toggle = (next: boolean) => {
    toggled.current = true
    setOpen(next)
  }

  if (!open) {
    return (
      <Button ref={button} variant="outline" onClick={() => toggle(true)}>
        Show the notice again
      </Button>
    )
  }

  return (
    <div className="relative w-full max-w-md">
      <Alert variant="info" className="pe-10">
        <InfoIcon />
        <AlertTitle>New in this version</AlertTitle>
        <AlertDescription>Routing rules can now match on the recipient domain.</AlertDescription>
      </Alert>
      <Button
        ref={button}
        variant="ghost"
        size="icon-sm"
        aria-label="Dismiss the notice"
        className="absolute end-2 top-1.5 size-6 rounded-full text-info-strong hover:bg-info-tag hover:text-info-strong [&_svg:not([class*='size-'])]:size-3.5"
        onClick={() => toggle(false)}
      >
        <XIcon />
      </Button>
    </div>
  )
}
