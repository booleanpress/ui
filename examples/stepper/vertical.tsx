import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@booleanpress/ui/stepper"

const STEPS = ["Connection", "Sender", "Test email"]

export default function StepperVertical() {
  return (
    <Stepper orientation="vertical" defaultValue={1} className="w-full max-w-2xl">
      <StepperList>
        {STEPS.map((title, index) => (
          <StepperItem key={title} step={index + 1}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperTitle>{title}</StepperTitle>
            </StepperTrigger>
            {index < STEPS.length - 1 ? <StepperSeparator /> : null}
            {/* In a vertical stepper each step's content sits in its own item, beside the line. */}
            <StepperContent>
              <div className="flex h-48 items-center justify-center rounded-sm border-2 border-dashed bg-subtle font-medium dark:bg-background">
                {title} settings
              </div>
            </StepperContent>
          </StepperItem>
        ))}
      </StepperList>
    </Stepper>
  )
}
