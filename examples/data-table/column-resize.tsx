import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Ticket = { id: string; subject: string; requester: string; priority: string }

const TICKETS: Ticket[] = [
  { id: "t-2081", subject: "Cannot connect to SES after rotating the access keys", requester: "Ana Ruiz", priority: "High" },
  { id: "t-2080", subject: "Invoice is missing a VAT number", requester: "Li Wei", priority: "Normal" },
  { id: "t-2079", subject: "Import stops at row 200 with no error", requester: "Sam Okoye", priority: "High" },
  { id: "t-2078", subject: "Change the sender name on receipts", requester: "Kim Park", priority: "Low" },
  { id: "t-2077", subject: "Webhook retries twice", requester: "Noor Haddad", priority: "Normal" },
]

const COLUMNS: DataTableColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "Ticket", size: 110, minSize: 80 },
  { accessorKey: "subject", header: "Subject", size: 260, minSize: 120 },
  { accessorKey: "requester", header: "Requester", size: 160, minSize: 100 },
  { accessorKey: "priority", header: "Priority", size: 120, minSize: 90 },
]

export default function DataTableColumnResize() {
  return <DataTable aria-label="Tickets" columnResizing gridlines columns={COLUMNS} data={TICKETS} getRowId={(row) => row.id} />
}
