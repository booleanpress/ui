import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Mailer = { name: string; provider: string; sent: number; failed: number }

const MAILERS: Mailer[] = [
  { name: "Transactional", provider: "Amazon SES", sent: 18402, failed: 12 },
  { name: "Marketing", provider: "Postmark", sent: 9610, failed: 31 },
  { name: "Password resets", provider: "Postmark", sent: 2150, failed: 0 },
  { name: "Internal alerts", provider: "SMTP relay", sent: 415, failed: 9 },
  { name: "Receipts", provider: "Amazon SES", sent: 7044, failed: 4 },
]

const COLUMNS: DataTableColumnDef<Mailer>[] = [
  { accessorKey: "name", header: "Mailer" },
  { accessorKey: "provider", header: "Provider" },
  { accessorKey: "sent", header: "Sent", meta: { align: "end" }, cell: ({ getValue }) => getValue<number>().toLocaleString("en-GB") },
  { accessorKey: "failed", header: "Failed", meta: { align: "end" } },
]

export default function DataTableGridlines() {
  return <DataTable aria-label="Mailers, last 30 days" gridlines columns={COLUMNS} data={MAILERS} />
}
