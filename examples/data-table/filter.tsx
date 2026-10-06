import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"
import { Badge } from "@booleanpress/ui/badge"

type Ticket = { id: string; subject: string; requester: string; status: "Open" | "Pending" | "Solved" }

const TICKETS: Ticket[] = [
  { id: "t-2081", subject: "Cannot connect to SES", requester: "Ana Ruiz", status: "Open" },
  { id: "t-2080", subject: "Invoice is missing a VAT number", requester: "Li Wei", status: "Pending" },
  { id: "t-2079", subject: "Import stops at row 200", requester: "Sam Okoye", status: "Open" },
  { id: "t-2078", subject: "Change the sender name", requester: "Kim Park", status: "Solved" },
  { id: "t-2077", subject: "Webhook retries twice", requester: "Noor Haddad", status: "Pending" },
  { id: "t-2076", subject: "Export to CSV is empty", requester: "Tom Becker", status: "Open" },
  { id: "t-2075", subject: "Add a second admin", requester: "Ines Costa", status: "Solved" },
]

const TONE = { Open: "info", Pending: "warning", Solved: "success" } as const
const STATUSES = ["Open", "Pending", "Solved"].map((value) => ({ label: value, value }))

const COLUMNS: DataTableColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "Ticket", meta: { filter: { placeholder: "Search" } } },
  { accessorKey: "subject", header: "Subject", meta: { filter: { placeholder: "Search" } } },
  { accessorKey: "requester", header: "Requester", meta: { filter: { placeholder: "Search" } } },
  {
    accessorKey: "status",
    header: "Status",
    meta: { filter: { variant: "select", placeholder: "Any", options: STATUSES } },
    cell: ({ row }) => <Badge variant={TONE[row.original.status]}>{row.original.status}</Badge>,
  },
]

export default function DataTableFilter() {
  return <DataTable aria-label="Tickets" filtering columns={COLUMNS} data={TICKETS} getRowId={(row) => row.id} />
}
