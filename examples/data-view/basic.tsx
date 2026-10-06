import { MailIcon, PencilIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { DataView } from "@booleanpress/ui/data-view"
import { useUiLocale } from "@booleanpress/ui/provider"

const MAILERS = [
  { id: "ses", name: "Transactional", provider: "Amazon SES", status: "Active", sent: 18432 },
  { id: "postmark", name: "Password resets", provider: "Postmark", status: "Active", sent: 2210 },
  { id: "mailgun", name: "Newsletter", provider: "Mailgun", status: "Paused", sent: 40125 },
  { id: "smtp", name: "Office relay", provider: "Custom SMTP", status: "Failing", sent: 312 },
  { id: "brevo", name: "Receipts", provider: "Brevo", status: "Active", sent: 9870 },
]
const TONE: Record<string, "success" | "warning" | "destructive"> = { Active: "success", Paused: "warning", Failing: "destructive" }

export default function DataViewBasic() {
  const { locale } = useUiLocale()
  const count = new Intl.NumberFormat(locale)

  return (
    <DataView
      aria-label="Mailers"
      items={MAILERS}
      getItemKey={(mailer) => mailer.id}
      className="w-full"
      renderItem={(mailer) => (
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <MailIcon className="size-5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-sm text-muted-foreground">{mailer.provider}</span>
            <span className="text-lg/normal font-medium">{mailer.name}</span>
          </div>
          <Badge variant={TONE[mailer.status]}>{mailer.status}</Badge>
          <span className="w-20 text-end text-lg font-semibold tabular-nums">{count.format(mailer.sent)}</span>
          <Button variant="outline" size="icon" aria-label={`Edit ${mailer.name}`}>
            <PencilIcon />
          </Button>
        </div>
      )}
    />
  )
}
