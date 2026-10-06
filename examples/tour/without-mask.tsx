import * as React from "react"
import { ArchiveIcon, RefreshCwIcon, SendIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Tour, type TourStep } from "@booleanpress/ui/tour"

export default function TourWithoutMask() {
  const [open, setOpen] = React.useState(false)
  const send = React.useRef<HTMLButtonElement>(null)
  const retry = React.useRef<HTMLButtonElement>(null)
  const archive = React.useRef<HTMLButtonElement>(null)

  const steps: TourStep[] = [
    { target: send, title: "Send a test", description: "Sends a test email through this mailer to your own address." },
    { target: retry, title: "Retry failures", description: "Queues every failed delivery of the last 24 hours again." },
    { target: archive, title: "Archive the log", description: "Moves deliveries older than 90 days to the archive." },
  ]

  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show the toolbar
      </Button>
      <div className="flex gap-2 rounded-lg border bg-card p-2">
        <Button ref={send} variant="ghost" size="sm">
          <SendIcon />
          Send test
        </Button>
        <Button ref={retry} variant="ghost" size="sm">
          <RefreshCwIcon />
          Retry
        </Button>
        <Button ref={archive} variant="ghost" size="sm">
          <ArchiveIcon />
          Archive
        </Button>
      </div>
      <Tour steps={steps} open={open} onOpenChange={setOpen} mask={false} />
    </div>
  )
}
