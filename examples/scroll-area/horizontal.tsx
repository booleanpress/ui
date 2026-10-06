import { ScrollArea, ScrollBar } from "@booleanpress/ui/scroll-area"

const MAILERS = ["Amazon SES", "Postmark", "SendGrid", "Mailgun", "Brevo", "SMTP relay", "Sendmail", "Resend"]

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea className="w-72 rounded-md border whitespace-nowrap">
      <div className="flex w-max gap-3 p-4">
        {MAILERS.map((name) => (
          <div key={name} className="rounded-md border px-3 py-2 text-sm">
            {name}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
