import * as React from "react"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Input } from "@booleanpress/ui/input"
import { Tour, type TourStep } from "@booleanpress/ui/tour"

export default function TourBasic() {
  const [open, setOpen] = React.useState(false)
  const create = React.useRef<HTMLButtonElement>(null)
  const search = React.useRef<HTMLDivElement>(null)
  const failures = React.useRef<HTMLDivElement>(null)

  const steps: TourStep[] = [
    {
      target: create,
      title: "Add a mailer",
      description: "Connect an SMTP server or an email API. Each mailer sends for one organisation.",
      placement: "bottom",
      align: "end",
    },
    { target: search, title: "Find a delivery", description: "Search the log by recipient, subject or message ID." },
    {
      target: failures,
      title: "Watch the failures",
      description: "Deliveries that failed in the last 24 hours. Open the log to retry them.",
      placement: "top",
    },
  ]

  return (
    <div className="flex w-full max-w-lg flex-col items-start gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Start tour
      </Button>
      <div className="flex w-full flex-col gap-4 rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">Mailers</h3>
          <Button ref={create} size="sm">
            <PlusIcon />
            New mailer
          </Button>
        </div>
        <div ref={search} className="relative">
          <SearchIcon className="absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search deliveries" placeholder="Search deliveries" className="ps-8" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Delivered today</p>
            <p className="text-xl font-semibold">1,284</p>
          </div>
          <div ref={failures} className="rounded-lg border p-3">
            <p className="text-muted-foreground">Failed</p>
            <p className="text-xl font-semibold text-destructive-strong">7</p>
          </div>
        </div>
      </div>
      <Tour steps={steps} open={open} onOpenChange={setOpen} />
    </div>
  )
}
