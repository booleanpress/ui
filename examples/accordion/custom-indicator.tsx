import { MinusIcon, PlusIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@booleanpress/ui/accordion"

const QUESTIONS = [
  { value: "keys", title: "Where do I find my API key?", body: "Under Settings, then API keys. A key is shown once, when you create it." },
  { value: "rotate", title: "How do I rotate a key?", body: "Create a new key, move your sites to it, then revoke the old one." },
  { value: "scopes", title: "What can a key do?", body: "Each key has scopes: send, read logs, or manage connections." },
]

// The trigger is the Tailwind group `accordion-trigger`: each icon shows in one state.
const indicator = (
  <>
    <PlusIcon className="size-3.5 group-data-[state=open]/accordion-trigger:hidden" />
    <MinusIcon className="hidden size-3.5 group-data-[state=open]/accordion-trigger:block" />
  </>
)

export default function AccordionCustomIndicator() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      {QUESTIONS.map((question) => (
        <AccordionItem key={question.value} value={question.value}>
          <AccordionTrigger indicator={indicator}>{question.title}</AccordionTrigger>
          <AccordionContent>{question.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
