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
]

const STATUS = { Open: "info", Pending: "warning", Solved: "success" } as const

const COLUMNS: DataTableColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "Ticket" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "requester", header: "Requester" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant={STATUS[row.original.status]}>{row.original.status}</Badge>,
  },
]

export default function DataTableMultipleSelection() {
  return (
    <DataTable
      aria-label="Tickets"
      selection="multiple"
      toolbar={<h3 className="text-sm font-semibold">Tickets</h3>}
      columns={COLUMNS}
      data={TICKETS}
      getRowId={(row) => row.id}
      initialState={{ rowSelection: { "t-2080": true } }}
    />
  )
}
