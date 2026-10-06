import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@booleanpress/ui/accordion"

export default function AccordionMultiple() {
  return (
    <Accordion type="multiple" defaultValue={["sending"]} className="w-full max-w-md">
      <AccordionItem value="sending">
        <AccordionTrigger>Sending</AccordionTrigger>
        <AccordionContent>
          Mail goes out through the primary connection. When it fails, the backup connection takes over.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tracking">
        <AccordionTrigger>Tracking</AccordionTrigger>
        <AccordionContent>
          Opens and clicks are counted per message. Tracking pixels are off for transactional email.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="retention">
        <AccordionTrigger>Retention</AccordionTrigger>
        <AccordionContent>
          Log entries older than 30 days are removed every night at 02:00.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
