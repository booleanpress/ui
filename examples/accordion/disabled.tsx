import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@booleanpress/ui/accordion"

export default function AccordionDisabled() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Accordion type="single" collapsible disabled>
        <AccordionItem value="reset">
          <AccordionTrigger>How do I reset my password?</AccordionTrigger>
          <AccordionContent>Choose Forgot password on the sign-in page.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="team">
          <AccordionTrigger>Can I invite my team?</AccordionTrigger>
          <AccordionContent>Yes, from Settings, then Members.</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="limit">
          <AccordionTrigger>What happens when I reach the sending limit?</AccordionTrigger>
          <AccordionContent>Mail waits in the queue and goes out when the limit resets at midnight.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="app" disabled>
          <AccordionTrigger>Is there a mobile app?</AccordionTrigger>
          <AccordionContent>Not yet.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
