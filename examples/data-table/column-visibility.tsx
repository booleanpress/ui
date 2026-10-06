import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type ApiKey = { id: string; name: string; prefix: string; scope: string; created: string; lastUsed: string }

const KEYS: ApiKey[] = [
  { id: "k-1", name: "Production", prefix: "bp_live_7f3a", scope: "Send", created: "2026-03-12", lastUsed: "2026-10-04" },
  { id: "k-2", name: "Staging", prefix: "bp_test_19c2", scope: "Send, read logs", created: "2026-05-02", lastUsed: "2026-10-01" },
  { id: "k-3", name: "Zapier", prefix: "bp_live_c08e", scope: "Read logs", created: "2026-07-21", lastUsed: "2026-09-28" },
  { id: "k-4", name: "Reporting script", prefix: "bp_live_aa51", scope: "Read logs", created: "2026-08-30", lastUsed: "2026-10-03" },
]

const COLUMNS: DataTableColumnDef<ApiKey>[] = [
  { accessorKey: "name", header: "Name", enableHiding: false },
  { accessorKey: "prefix", header: "Key", meta: { cellClassName: "font-mono text-xs" } },
  { accessorKey: "scope", header: "Scope" },
  { accessorKey: "created", header: "Created" },
  { accessorKey: "lastUsed", header: "Last used" },
]

export default function DataTableColumnVisibility() {
  return (
    <DataTable
      aria-label="API keys"
      columnVisibility
      columns={COLUMNS}
      data={KEYS}
      getRowId={(row) => row.id}
      initialState={{ columnVisibility: { created: false } }}
    />
  )
}
