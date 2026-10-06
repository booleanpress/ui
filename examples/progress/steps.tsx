import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Progress } from "@booleanpress/ui/progress"

const STEPS = ["Choose a mailer", "Connect it", "Set the sender", "Send a test"]

export default function ProgressSteps() {
  const [step, setStep] = useState(2)
  const label = `Step ${step} of ${STEPS.length}: ${STEPS[step - 1]}`

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span>{STEPS[step - 1]}</span>
        <span className="text-muted-foreground tabular-nums">
          Step {step} of {STEPS.length}
        </span>
      </div>
      <Progress
        value={(step / STEPS.length) * 100}
        steps={STEPS.length}
        aria-label="Mailer setup"
        getValueLabel={() => label}
      />
      <div className="flex justify-between">
        <Button size="sm" variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button size="sm" variant="ghost" disabled={step === STEPS.length} onClick={() => setStep(step + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}
