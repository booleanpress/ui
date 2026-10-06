import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@booleanpress/ui/stepper"

const STEPS = ["Received", "In progress", "Resolved"]

export default function StepperStepsOnly() {
  return (
    <Stepper defaultValue={1} className="w-full max-w-xl">
      <StepperList aria-label="Ticket status">
        {STEPS.map((title, index) => (
          <StepperItem key={title} step={index + 1}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperTitle>{title}</StepperTitle>
            </StepperTrigger>
            {index < STEPS.length - 1 ? <StepperSeparator /> : null}
          </StepperItem>
        ))}
      </StepperList>
    </Stepper>
  )
}
