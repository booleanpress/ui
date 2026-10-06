import { CreditCardIcon, LockIcon, MailIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@booleanpress/ui/accordion"
import { Badge } from "@booleanpress/ui/badge"

const SECTIONS = [
  { value: "mail", icon: MailIcon, title: "Mail delivery", badge: { label: "Healthy", variant: "success" }, body: "98.6% of 12,480 messages delivered in the last 7 days." },
  { value: "security", icon: LockIcon, title: "Security", badge: { label: "2 warnings", variant: "warning" }, body: "Two API keys have not been used for 90 days. Revoke them if they are no longer needed." },
  { value: "billing", icon: CreditCardIcon, title: "Billing", badge: { label: "Pro", variant: "secondary" }, body: "The Pro plan renews on 1 November 2026." },
] as const

export default function AccordionTemplate() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md rounded-md border [&>*:last-child]:border-b-0">
      {SECTIONS.map(({ value, icon: Icon, title, badge, body }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>
            <span className="flex flex-1 items-center gap-2">
              <Icon className="text-muted-foreground" />
              {title}
              <Badge variant={badge.variant} className="ms-auto">
                {badge.label}
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>{body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
