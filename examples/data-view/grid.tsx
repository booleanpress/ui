import { MailIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { DataView } from "@booleanpress/ui/data-view"
import { useUiLocale } from "@booleanpress/ui/provider"

const MAILERS = [
  { id: "ses", name: "Transactional", provider: "Amazon SES", status: "Active", sent: 18432 },
  { id: "postmark", name: "Password resets", provider: "Postmark", status: "Active", sent: 2210 },
  { id: "mailgun", name: "Newsletter", provider: "Mailgun", status: "Paused", sent: 40125 },
  { id: "smtp", name: "Office relay", provider: "Custom SMTP", status: "Failing", sent: 312 },
]
const TONE: Record<string, "success" | "warning" | "destructive"> = { Active: "success", Paused: "warning", Failing: "destructive" }

export default function DataViewGrid() {
  const { locale } = useUiLocale()
  const count = new Intl.NumberFormat(locale)

  return (
    <DataView
      aria-label="Mailers"
      items={MAILERS}
      getItemKey={(mailer) => mailer.id}
      defaultLayout="grid"
      className="w-full"
      renderItem={(mailer) => (
        <div className="flex h-full flex-col gap-4 rounded-sm border p-6">
          <div className="relative flex h-28 items-center justify-center rounded-sm bg-subtle text-muted-foreground">
            <MailIcon className="size-8" aria-hidden="true" />
            <Badge variant={TONE[mailer.status]} className="absolute start-1 top-1">
              {mailer.status}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{mailer.provider}</span>
            <span className="text-lg/normal font-medium">{mailer.name}</span>
          </div>
          <span className="text-2xl font-semibold tabular-nums">{count.format(mailer.sent)}</span>
          <Button className="mt-auto">Send a test</Button>
        </div>
      )}
    />
  )
}
