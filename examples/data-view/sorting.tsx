import { DataView, type DataViewSortOption } from "@booleanpress/ui/data-view"
import { useUiLocale } from "@booleanpress/ui/provider"

type Mailer = { id: string; name: string; provider: string; sent: number }

const MAILERS: Mailer[] = [
  { id: "ses", name: "Transactional", provider: "Amazon SES", sent: 18432 },
  { id: "postmark", name: "Password resets", provider: "Postmark", sent: 2210 },
  { id: "mailgun", name: "Newsletter", provider: "Mailgun", sent: 40125 },
  { id: "smtp", name: "Office relay", provider: "Custom SMTP", sent: 312 },
  { id: "brevo", name: "Receipts", provider: "Brevo", sent: 9870 },
]

const SORTS: DataViewSortOption<Mailer>[] = [
  { value: "most-sent", label: "Most sent first", compare: (a, b) => b.sent - a.sent },
  { value: "least-sent", label: "Least sent first", compare: (a, b) => a.sent - b.sent },
  { value: "name", label: "Name, A to Z", compare: (a, b) => a.name.localeCompare(b.name) },
]

export default function DataViewSorting() {
  const { locale } = useUiLocale()
  const count = new Intl.NumberFormat(locale)

  return (
    <DataView
      aria-label="Mailers"
      items={MAILERS}
      getItemKey={(mailer) => mailer.id}
      sortOptions={SORTS}
      defaultSort="most-sent"
      className="w-full"
      renderItem={(mailer) => (
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col">
            <span className="font-medium">{mailer.name}</span>
            <span className="text-sm text-muted-foreground">{mailer.provider}</span>
          </div>
          <span className="text-lg font-semibold tabular-nums">{count.format(mailer.sent)}</span>
        </div>
      )}
    />
  )
}
