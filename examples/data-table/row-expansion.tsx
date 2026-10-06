import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"
import { Badge } from "@booleanpress/ui/badge"

type Event = { time: string; event: string }
type Delivery = { id: string; recipient: string; subject: string; status: "Delivered" | "Bounced"; events: Event[] }

const DELIVERIES: Delivery[] = [
  { id: "d-1042", recipient: "ana@example.com", subject: "Your October invoice", status: "Delivered", events: [{ time: "10:42:01", event: "Accepted by Amazon SES" }, { time: "10:42:03", event: "Delivered to mx.example.com" }, { time: "11:05:40", event: "Opened" }] },
  { id: "d-1041", recipient: "li.wei@example.com", subject: "Password reset", status: "Bounced", events: [{ time: "10:40:12", event: "Accepted by Postmark" }, { time: "10:40:15", event: "Bounced: mailbox full (552)" }] },
  { id: "d-1040", recipient: "sam@example.com", subject: "Welcome aboard", status: "Delivered", events: [{ time: "09:58:30", event: "Accepted by Amazon SES" }, { time: "09:58:31", event: "Delivered to mx.example.com" }] },
  { id: "d-1039", recipient: "kim@example.com", subject: "Weekly digest", status: "Delivered", events: [{ time: "17:15:00", event: "Accepted by SMTP relay" }, { time: "17:15:09", event: "Delivered to mail.example.com" }] },
]

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={row.original.status === "Bounced" ? "destructive" : "success"}>{row.original.status}</Badge> },
]

export default function DataTableRowExpansion() {
  return (
    <DataTable
      aria-label="Deliveries"
      columns={COLUMNS}
      data={DELIVERIES}
      getRowId={(row) => row.id}
      initialState={{ expanded: { "d-1042": true } }}
      renderSubRow={(row) => (
        <div className="rounded-md bg-subtle p-4">
          <p className="mb-2 font-semibold">Events for {row.original.id}</p>
          <ol className="flex flex-col gap-1 text-muted-foreground">
            {row.original.events.map((item) => (
              <li key={item.time} className="flex gap-4">
                <span className="tabular-nums">{item.time}</span>
                <span className="text-foreground">{item.event}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    />
  )
}
