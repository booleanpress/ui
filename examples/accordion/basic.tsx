import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@booleanpress/ui/accordion"

export default function AccordionBasic() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="log">
        <AccordionTrigger>What does the delivery log record?</AccordionTrigger>
        <AccordionContent>
          Every email the site sends: the recipient, the subject, the status and the mail server&apos;s reply. Entries are
          kept for 30 days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="resend">
        <AccordionTrigger>Can I resend a failed email?</AccordionTrigger>
        <AccordionContent>
          Yes. Open the entry in the log and choose Resend. The new attempt gets its own entry.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="providers">
        <AccordionTrigger>Which mail providers can I connect?</AccordionTrigger>
        <AccordionContent>
          Any SMTP server, and Amazon SES, Mailgun, Postmark and SendGrid through their APIs.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
