import { Badge } from "@booleanpress/ui/badge"
import { DataView } from "@booleanpress/ui/data-view"

const SUBJECTS = ["SMTP login fails", "Bounce notices missing", "Rotate the API key", "Emails land in spam", "Webhook times out"]
const STATUSES = ["Open", "Pending", "Closed"] as const
const TONE = { Open: "info", Pending: "warning", Closed: "secondary" } as const

// 23 tickets, numbered from #2040, so the last page is a short one.
const TICKETS = Array.from({ length: 23 }, (_, index) => ({
  id: 2040 + index,
  subject: SUBJECTS[index % SUBJECTS.length],
  status: STATUSES[index % STATUSES.length],
}))

export default function DataViewPagination() {
  return (
    <DataView
      aria-label="Tickets"
      items={TICKETS}
      getItemKey={(ticket) => ticket.id}
      pageSize={5}
      className="w-full"
      renderItem={(ticket) => (
        <div className="flex items-center gap-4">
          <span className="w-14 text-sm text-muted-foreground tabular-nums">#{ticket.id}</span>
          <span className="min-w-0 flex-1 truncate font-medium">{ticket.subject}</span>
          <Badge variant={TONE[ticket.status]}>{ticket.status}</Badge>
        </div>
      )}
    />
  )
}
