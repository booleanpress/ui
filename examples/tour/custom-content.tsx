import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { Kbd, KbdGroup } from "@booleanpress/ui/kbd"
import { Tour, type TourStep } from "@booleanpress/ui/tour"

export default function TourCustomContent() {
  const [open, setOpen] = React.useState(false)
  const palette = React.useRef<HTMLButtonElement>(null)

  const steps: TourStep[] = [
    {
      title: "Welcome to the delivery log",
      description: "Two things help you move around it faster.",
      content: (
        <ul className="list-disc space-y-1 ps-4 text-muted-foreground">
          <li>The command palette finds any mailer or setting.</li>
          <li>Every row opens the full delivery report.</li>
        </ul>
      ),
    },
    {
      target: palette,
      title: "Open the command palette",
      description: "Search mailers, organisations and settings from anywhere.",
      content: (
        <p className="flex items-center gap-2 text-muted-foreground">
          Press
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </p>
      ),
    },
  ]

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Start tour
      </Button>
      <Button ref={palette} variant="secondary">
        Search…
      </Button>
      <Tour steps={steps} open={open} onOpenChange={setOpen} />
    </div>
  )
}
