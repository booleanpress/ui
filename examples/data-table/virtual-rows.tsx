import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Delivery = { id: number; recipient: string; mailer: string; status: string; opens: number }

const MAILERS = ["Amazon SES", "Postmark", "SMTP relay"]
const STATUSES = ["Delivered", "Delivered", "Delivered", "Bounced", "Deferred"]

// 10,000 deliveries, computed from their index so every visit shows the same rows.
const DELIVERIES: Delivery[] = Array.from({ length: 10000 }, (_, index) => ({
  id: 100000 + index,
  recipient: `customer${index + 1}@example.com`,
  mailer: MAILERS[index % 3],
  status: STATUSES[(index * 7) % 5],
  opens: (index * 13) % 31,
}))

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "id", header: "Delivery", size: 120 },
  { accessorKey: "recipient", header: "Recipient", size: 260 },
  { accessorKey: "mailer", header: "Mailer", size: 160 },
  { accessorKey: "status", header: "Status", size: 140 },
  { accessorKey: "opens", header: "Opens", size: 100, meta: { align: "end" } },
]

export default function DataTableVirtualRows() {
  return (
    <DataTable
      aria-label="All deliveries"
      virtual
      stickyHeader
      sorting
      maxHeight={420}
      columns={COLUMNS}
      data={DELIVERIES}
      getRowId={(row) => String(row.id)}
    />
  )
}
