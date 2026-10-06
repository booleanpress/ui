import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Delivery = { id: string; recipient: string; mailer: string; opens: number; sent: string }

const DELIVERIES: Delivery[] = [
  { id: "d-1042", recipient: "ana@example.com", mailer: "Amazon SES", opens: 3, sent: "2026-10-04 10:42" },
  { id: "d-1041", recipient: "li.wei@example.com", mailer: "Postmark", opens: 0, sent: "2026-10-04 10:40" },
  { id: "d-1040", recipient: "sam@example.com", mailer: "Amazon SES", opens: 7, sent: "2026-10-04 09:58" },
  { id: "d-1039", recipient: "kim@example.com", mailer: "SMTP relay", opens: 1, sent: "2026-10-03 17:15" },
  { id: "d-1038", recipient: "noor@example.com", mailer: "Postmark", opens: 12, sent: "2026-10-03 16:02" },
  { id: "d-1037", recipient: "tom@example.com", mailer: "Amazon SES", opens: 2, sent: "2026-10-03 08:30" },
]

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "mailer", header: "Mailer" },
  { accessorKey: "opens", header: "Opens", meta: { align: "end" } },
  { accessorKey: "sent", header: "Sent", sortFn: "alphanumeric" },
]

export default function DataTableSort() {
  return (
    <DataTable
      aria-label="Deliveries"
      sorting
      columns={COLUMNS}
      data={DELIVERIES}
      getRowId={(row) => row.id}
      initialState={{ sorting: [{ id: "sent", desc: true }] }}
    />
  )
}
