import { AtSignIcon, SendIcon, ServerIcon } from "lucide-react"
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@booleanpress/ui/stepper"

const STEPS = [
  { title: "Connection", icon: ServerIcon, text: "Choose the mail server and its port." },
  { title: "Sender", icon: AtSignIcon, text: "Set the name and address emails come from." },
  { title: "Test email", icon: SendIcon, text: "Send a test to check that mail arrives." },
]

export default function StepperCustomIndicator() {
  return (
    <Stepper defaultValue={1} className="w-full max-w-xl">
      <StepperList aria-label="Mailer setup">
        {STEPS.map((step, index) => (
          <StepperItem key={step.title} step={index + 1}>
            <StepperTrigger>
              {/* Children replace the number; the current step's circle fills with the primary colour. */}
              <StepperIndicator className="size-12 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <step.icon />
              </StepperIndicator>
              <StepperTitle className="sr-only">{step.title}</StepperTitle>
            </StepperTrigger>
            {index < STEPS.length - 1 ? <StepperSeparator /> : null}
          </StepperItem>
        ))}
      </StepperList>
      {STEPS.map((step, index) => (
        <StepperContent key={step.title} step={index + 1} className="flex flex-col items-center gap-4 text-center">
          <h4 className="text-xl font-semibold">{step.title}</h4>
          <p className="text-muted-foreground">{step.text}</p>
          <StepperNext className="self-end" />
        </StepperContent>
      ))}
    </Stepper>
  )
}
