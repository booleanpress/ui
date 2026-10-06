import { useState } from "react"
import type { DataTableColumnDef } from "@booleanpress/ui/data-table"
import { ReorderableDataTable } from "@booleanpress/ui/data-table-reorder"

type Connection = { id: string; name: string; provider: string; region: string; dailyLimit: number }

const CONNECTIONS: Connection[] = [
  { id: "c-1", name: "Transactional", provider: "Amazon SES", region: "eu-west-1", dailyLimit: 50000 },
  { id: "c-2", name: "Receipts", provider: "Postmark", region: "us-east-1", dailyLimit: 20000 },
  { id: "c-3", name: "Newsletters", provider: "Mailgun", region: "eu-central-1", dailyLimit: 100000 },
  { id: "c-4", name: "Fallback relay", provider: "SMTP relay", region: "On premises", dailyLimit: 5000 },
  { id: "c-5", name: "Alerts", provider: "SendGrid", region: "us-west-2", dailyLimit: 10000 },
]

const number = new Intl.NumberFormat("en-US")

const COLUMNS: DataTableColumnDef<Connection>[] = [
  { accessorKey: "name", header: "Connection" },
  { accessorKey: "provider", header: "Provider" },
  { accessorKey: "region", header: "Region" },
  {
    accessorKey: "dailyLimit",
    header: "Daily limit",
    meta: { align: "end" },
    cell: ({ row }) => number.format(row.original.dailyLimit),
  },
]

export default function DataTableRowReorder() {
  const [connections, setConnections] = useState(CONNECTIONS)

  return (
    <ReorderableDataTable
      aria-label="Connections in the order they are tried"
      columns={COLUMNS}
      data={connections}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      onRowOrderChange={setConnections}
    />
  )
}
