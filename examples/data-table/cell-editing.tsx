import { useState } from "react"
import { DataTable, type DataTableCellEdit, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Mailer = { id: string; name: string; provider: string; dailyLimit: number }

const PROVIDERS = ["Amazon SES", "Postmark", "SMTP relay"].map((value) => ({ label: value, value }))

const COLUMNS: DataTableColumnDef<Mailer>[] = [
  { accessorKey: "name", header: "Mailer", meta: { editor: "text" } },
  { accessorKey: "provider", header: "Provider", meta: { editor: "select", editorOptions: PROVIDERS } },
  {
    accessorKey: "dailyLimit",
    header: "Daily limit",
    meta: { editor: "number", align: "end" },
    cell: ({ getValue }) => getValue<number>().toLocaleString("en-GB"),
  },
]

export default function DataTableCellEditing() {
  const [mailers, setMailers] = useState<Mailer[]>([
    { id: "m-1", name: "Transactional", provider: "Amazon SES", dailyLimit: 50000 },
    { id: "m-2", name: "Marketing", provider: "Postmark", dailyLimit: 20000 },
    { id: "m-3", name: "Password resets", provider: "Postmark", dailyLimit: 5000 },
    { id: "m-4", name: "Internal alerts", provider: "SMTP relay", dailyLimit: 1000 },
  ])

  const onCellEdit = ({ rowId, columnId, value }: DataTableCellEdit<Mailer>) =>
    setMailers((rows) => rows.map((row) => (row.id === rowId ? { ...row, [columnId]: value ?? 0 } : row)))

  return <DataTable aria-label="Mailers" columns={COLUMNS} data={mailers} getRowId={(row) => row.id} onCellEdit={onCellEdit} />
}
