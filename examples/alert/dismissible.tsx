import { useEffect, useRef, useState } from "react"
import { InfoIcon, XIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"

export default function AlertDismissible() {
  const [open, setOpen] = useState(true)
  const toggled = useRef(false)
  const dismiss = useRef<HTMLButtonElement>(null)
  const showAgain = useRef<HTMLButtonElement>(null)

  // The button that was pressed is gone or going: focus the one that takes its place.
  useEffect(() => {
    if (!toggled.current) return
    if (open) dismiss.current?.focus()
    else showAgain.current?.focus()
  }, [open])

  const toggle = (next: boolean) => {
    toggled.current = true
    setOpen(next)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      {/* `open` fades the alert out before it leaves, and back in when it returns. */}
      <Alert open={open} variant="info" className="pe-10">
        <InfoIcon />
        <AlertTitle>New in this version</AlertTitle>
        <AlertDescription>Routing rules can now match on the recipient domain.</AlertDescription>
        <Button
          ref={dismiss}
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss the notice"
          className="absolute end-2 top-1.5 size-6 rounded-full text-info-strong hover:bg-info-tag hover:text-info-strong [&_svg:not([class*='size-'])]:size-3.5"
          onClick={() => toggle(false)}
        >
          <XIcon />
        </Button>
      </Alert>
      {open ? null : (
        <Button ref={showAgain} variant="outline" onClick={() => toggle(true)}>
          Show the notice again
        </Button>
      )}
    </div>
  )
}
