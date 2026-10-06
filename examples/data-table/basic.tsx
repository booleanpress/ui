import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Delivery = { id: string; recipient: string; subject: string; mailer: string }

const DELIVERIES: Delivery[] = [
  { id: "d-1042", recipient: "ana@example.com", subject: "Your October invoice", mailer: "Amazon SES" },
  { id: "d-1041", recipient: "li.wei@example.com", subject: "Password reset", mailer: "Postmark" },
  { id: "d-1040", recipient: "sam@example.com", subject: "Welcome aboard", mailer: "Amazon SES" },
  { id: "d-1039", recipient: "kim@example.com", subject: "Weekly digest", mailer: "SMTP relay" },
  { id: "d-1038", recipient: "noor@example.com", subject: "Your receipt", mailer: "Postmark" },
]

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "id", header: "Code" },
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "mailer", header: "Mailer" },
]

export default function DataTableBasic() {
  return <DataTable aria-label="Recent deliveries" columns={COLUMNS} data={DELIVERIES} getRowId={(row) => row.id} />
}
