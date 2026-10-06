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
  { title: "Connection", description: "smtp.example.com:587" },
  { title: "Authentication", description: "535: credentials rejected", error: true },
  { title: "Test email", description: "Not sent yet" },
]

export default function StepperErrorState() {
  return (
    <Stepper defaultValue={2} className="w-full max-w-2xl">
      <StepperList aria-label="Connection check">
        {STEPS.map((step, index) => (
          <StepperItem key={step.title} step={index + 1} error={step.error}>
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
