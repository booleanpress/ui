import { useState } from "react"
import { Field, FieldError, FieldLabel } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@booleanpress/ui/stepper"

const STEPS = ["Provider", "API key", "Review"]
const PROVIDERS = ["Amazon SES", "Mailgun", "Postmark"]

export default function StepperWizard() {
  const [step, setStep] = useState(1)
  const [provider, setProvider] = useState("Mailgun")
  const [apiKey, setApiKey] = useState("")
  const [missingKey, setMissingKey] = useState(false)
  const [connected, setConnected] = useState(false)

  return (
    <Stepper linear value={step} onValueChange={setStep} className="w-full max-w-xl">
      <StepperList aria-label="Connect a mailer">
        {STEPS.map((title, index) => (
          <StepperItem key={title} step={index + 1} error={index === 1 && missingKey}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperTitle>{title}</StepperTitle>
            </StepperTrigger>
            {index < STEPS.length - 1 ? <StepperSeparator /> : null}
          </StepperItem>
        ))}
      </StepperList>
      <StepperContent step={1}>
        <RadioGroup aria-label="Provider" value={provider} onValueChange={setProvider}>
          {PROVIDERS.map((name) => (
            <Field key={name} orientation="horizontal">
              <RadioGroupItem id={`provider-${name}`} value={name} />
              <FieldLabel htmlFor={`provider-${name}`}>{name}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </StepperContent>
      <StepperContent step={2}>
        <Field data-invalid={missingKey || undefined}>
          <FieldLabel htmlFor="wizard-key">{provider} API key</FieldLabel>
          <Input
            id="wizard-key"
            value={apiKey}
            aria-invalid={missingKey || undefined}
            aria-describedby={missingKey ? "wizard-key-error" : undefined}
            onChange={(event) => setApiKey(event.target.value)}
          />
          {missingKey ? <FieldError id="wizard-key-error">Paste the key to continue.</FieldError> : null}
        </Field>
      </StepperContent>
      <StepperContent step={3}>
        <p>{connected ? `${provider} is connected.` : `Connect ${provider} with the key ending ${apiKey.slice(-4)}?`}</p>
      </StepperContent>
      <div className="flex justify-between px-1.5">
        <StepperPrevious />
        <StepperNext
          disabled={connected}
          onClick={(event) => {
            const blocked = step === 2 && apiKey.trim() === ""
            setMissingKey(blocked)
            if (blocked) event.preventDefault()
            if (step === 3) setConnected(true)
          }}
        />
      </div>
    </Stepper>
  )
}
