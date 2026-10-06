import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Delivery = { id: string; mailer: string; recipient: string; subject: string; sent: number }

const DELIVERIES: Delivery[] = [
  { id: "1", mailer: "Amazon SES", recipient: "ana@example.com", subject: "Your October invoice", sent: 1840 },
  { id: "2", mailer: "Postmark", recipient: "li.wei@example.com", subject: "Password reset", sent: 960 },
  { id: "3", mailer: "Amazon SES", recipient: "sam@example.com", subject: "Welcome aboard", sent: 312 },
  { id: "4", mailer: "SMTP relay", recipient: "kim@example.com", subject: "Weekly digest", sent: 215 },
  { id: "5", mailer: "Postmark", recipient: "noor@example.com", subject: "Your receipt", sent: 488 },
  { id: "6", mailer: "Amazon SES", recipient: "tom@example.com", subject: "Trial ends soon", sent: 97 },
]

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "mailer", header: "Mailer" },
  {
    accessorKey: "recipient",
    header: "Recipient",
    aggregationFn: "count",
    aggregatedCell: () => <span className="font-normal text-muted-foreground">Group total</span>,
  },
  { accessorKey: "subject", header: "Subject" },
  {
    accessorKey: "sent",
    header: "Sent",
    aggregationFn: "sum",
    meta: { align: "end" },
    cell: ({ getValue }) => getValue<number>().toLocaleString("en-GB"),
    aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString("en-GB"),
  },
]

export default function DataTableRowGrouping() {
  return (
    <DataTable
      aria-label="Deliveries by mailer"
      grouping
      columns={COLUMNS}
      data={DELIVERIES}
      getRowId={(row) => row.id}
      initialState={{ grouping: ["mailer"] }}
    />
  )
}
