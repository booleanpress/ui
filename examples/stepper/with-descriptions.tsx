import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@booleanpress/ui/stepper"

const STEPS = [
  { title: "Domain", description: "Add example.com" },
  { title: "DNS records", description: "SPF, DKIM and DMARC" },
  { title: "Verify", description: "Usually under an hour" },
]

export default function StepperWithDescriptions() {
  return (
    <Stepper defaultValue={2} className="w-full max-w-2xl">
      <StepperList aria-label="Domain setup">
        {STEPS.map((step, index) => (
          <StepperItem key={step.title} step={index + 1}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperTitle>{step.title}</StepperTitle>
              <StepperDescription>{step.description}</StepperDescription>
            </StepperTrigger>
            {index < STEPS.length - 1 ? <StepperSeparator /> : null}
          </StepperItem>
        ))}
      </StepperList>
    </Stepper>
  )
}
