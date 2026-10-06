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

export default function StepperHorizontal() {
  return (
    <Stepper defaultValue={1} className="w-full max-w-2xl">
      <StepperList>
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
      {STEPS.map((title, index) => (
        <StepperContent key={title} step={index + 1}>
          <div className="flex h-48 items-center justify-center rounded-sm border-2 border-dashed bg-subtle font-medium dark:bg-background">
            {title} settings
          </div>
        </StepperContent>
      ))}
    </Stepper>
  )
}
