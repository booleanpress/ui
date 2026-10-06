import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"
import { Badge } from "@booleanpress/ui/badge"

type Delivery = { id: string; recipient: string; subject: string; status: "Delivered" | "Bounced" | "Deferred" }

const SUBJECTS = ["Your October invoice", "Password reset", "Welcome aboard", "Weekly digest", "Your receipt"]
const STATUSES = ["Delivered", "Delivered", "Bounced", "Delivered", "Deferred"] as const

// 57 deliveries, built from fixed lists so every visit shows the same rows.
const DELIVERIES: Delivery[] = Array.from({ length: 57 }, (_, index) => ({
  id: `d-${1100 - index}`,
  recipient: `customer${String(index + 1).padStart(2, "0")}@example.com`,
  subject: SUBJECTS[index % SUBJECTS.length],
  status: STATUSES[index % STATUSES.length],
}))

const TONE = { Delivered: "success", Bounced: "destructive", Deferred: "warning" } as const

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "id", header: "Delivery" },
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={TONE[row.original.status]}>{row.original.status}</Badge> },
]

export default function DataTablePagination() {
  return <DataTable aria-label="Deliveries" pagination columns={COLUMNS} data={DELIVERIES} getRowId={(row) => row.id} />
}
