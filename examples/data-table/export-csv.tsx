import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Delivery = { id: string; recipient: string; subject: string; mailer: string; opens: number }

const DELIVERIES: Delivery[] = [
  { id: "d-1042", recipient: "ana@example.com", subject: "Your October invoice", mailer: "Amazon SES", opens: 3 },
  { id: "d-1041", recipient: "li.wei@example.com", subject: "Password reset", mailer: "Postmark", opens: 0 },
  { id: "d-1040", recipient: "sam@example.com", subject: "Welcome aboard", mailer: "Amazon SES", opens: 7 },
  { id: "d-1039", recipient: "kim@example.com", subject: "Weekly digest, October", mailer: "SMTP relay", opens: 1 },
  { id: "d-1038", recipient: "noor@example.com", subject: "Your receipt", mailer: "Postmark", opens: 12 },
]

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "id", header: "Delivery" },
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "mailer", header: "Mailer" },
  { accessorKey: "opens", header: "Opens", meta: { align: "end" } },
]

export default function DataTableExportCsv() {
  return (
    <DataTable
      aria-label="Deliveries"
      sorting
      exportCsv="deliveries.csv"
      toolbar={<p className="text-sm text-muted-foreground">Saves the visible columns and rows, in the order shown.</p>}
      columns={COLUMNS}
      data={DELIVERIES}
      getRowId={(row) => row.id}
    />
  )
}
