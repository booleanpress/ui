import { MailIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { DataView } from "@booleanpress/ui/data-view"

const MAILERS = [
  { id: "ses", name: "Transactional", provider: "Amazon SES", status: "Active" },
  { id: "postmark", name: "Password resets", provider: "Postmark", status: "Active" },
  { id: "mailgun", name: "Newsletter", provider: "Mailgun", status: "Paused" },
  { id: "smtp", name: "Office relay", provider: "Custom SMTP", status: "Failing" },
]
const TONE: Record<string, "success" | "warning" | "destructive"> = { Active: "success", Paused: "warning", Failing: "destructive" }

export default function DataViewLayoutToggleExample() {
  return (
    <DataView
      aria-label="Mailers"
      items={MAILERS}
      getItemKey={(mailer) => mailer.id}
      layoutToggle
      defaultLayout="grid"
      className="w-full"
      renderItem={(mailer, layout) =>
        layout === "list" ? (
          <div className="flex items-center gap-4">
            <MailIcon className="size-5 text-muted-foreground" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-medium">{mailer.name}</span>
              <span className="text-sm text-muted-foreground">{mailer.provider}</span>
            </div>
            <Badge variant={TONE[mailer.status]}>{mailer.status}</Badge>
            <Button variant="outline" size="sm">
              Send a test
            </Button>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-3 rounded-sm border p-6">
            <div className="flex items-start justify-between gap-2">
              <MailIcon className="size-6 text-muted-foreground" aria-hidden="true" />
              <Badge variant={TONE[mailer.status]}>{mailer.status}</Badge>
            </div>
            <span className="text-lg/normal font-medium">{mailer.name}</span>
            <span className="text-sm text-muted-foreground">{mailer.provider}</span>
            <Button variant="outline" size="sm" className="mt-auto">
              Send a test
            </Button>
          </div>
        )
      }
    />
  )
}
