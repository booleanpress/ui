import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { Tour, type TourStep } from "@booleanpress/ui/tour"

const SECTIONS = ["Sender", "Connection", "Limits"]

export default function TourControlled() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [finished, setFinished] = React.useState(false)
  const refs = [React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null)]

  const steps: TourStep[] = SECTIONS.map((name, index) => ({
    target: refs[index],
    title: name,
    description: `Step ${index + 1} of the mailer settings: what the ${name.toLowerCase()} section holds.`,
    placement: "right",
  }))

  const start = (from: number) => {
    setStep(from)
    setFinished(false)
    setOpen(true)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => start(0)}>
          Start tour
        </Button>
        <Button variant="ghost" onClick={() => start(2)}>
          Start at Limits
        </Button>
      </div>
      <div className="flex w-48 flex-col gap-2">
        {SECTIONS.map((name, index) => (
          <div key={name} ref={refs[index]} className="rounded-md border bg-card px-3 py-2 text-sm">
            {name}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {open ? `Showing step ${step + 1} of ${steps.length}.` : finished ? "Tour finished." : "The tour is closed."}
      </p>
      <Tour steps={steps} open={open} onOpenChange={setOpen} step={step} onStepChange={setStep} onFinish={() => setFinished(true)} />
    </div>
  )
}
