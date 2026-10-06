import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@booleanpress/ui/accordion"
import { Button } from "@booleanpress/ui/button"

const PANELS = [
  { value: "smtp", title: "SMTP connection", body: "Host smtp.example.com, port 587, STARTTLS, signed in as mailer@example.com." },
  { value: "sender", title: "Sender", body: "Mail is sent from Acme Support <support@example.com>, replies go to the help desk." },
  { value: "alerts", title: "Failure alerts", body: "After three failed sends in ten minutes, an alert goes to ops@example.com." },
]

export default function AccordionControlled() {
  const [open, setOpen] = useState("smtp")

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {PANELS.map((panel, index) => (
          <Button
            key={panel.value}
            variant={open === panel.value ? "default" : "secondary"}
            onClick={() => setOpen(panel.value)}
          >
            Panel {index + 1}
          </Button>
        ))}
        <Button variant="destructive" onClick={() => setOpen("")}>
          Close all
        </Button>
      </div>
      <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
        {PANELS.map((panel) => (
          <AccordionItem key={panel.value} value={panel.value}>
            <AccordionTrigger>{panel.title}</AccordionTrigger>
            <AccordionContent>{panel.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
