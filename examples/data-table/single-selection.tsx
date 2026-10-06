import { useState } from "react"
import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Mailer = { id: string; name: string; provider: string; region: string }

const MAILERS: Mailer[] = [
  { id: "ses-eu", name: "Transactional", provider: "Amazon SES", region: "eu-west-1" },
  { id: "pm-main", name: "Marketing", provider: "Postmark", region: "us-east-1" },
  { id: "smtp-int", name: "Internal alerts", provider: "SMTP relay", region: "On premises" },
  { id: "ses-us", name: "Receipts", provider: "Amazon SES", region: "us-east-2" },
]

const COLUMNS: DataTableColumnDef<Mailer>[] = [
  { accessorKey: "name", header: "Mailer" },
  { accessorKey: "provider", header: "Provider" },
  { accessorKey: "region", header: "Region" },
]

export default function DataTableSingleSelection() {
  const [rowSelection, setRowSelection] = useState<Record<string, true>>({ "ses-eu": true })
  const chosen = MAILERS.find((mailer) => rowSelection[mailer.id])

  return (
    <div className="flex w-full flex-col gap-3">
      <DataTable
        aria-label="Default mailer"
        selection="single"
        columns={COLUMNS}
        data={MAILERS}
        getRowId={(row) => row.id}
        state={{ rowSelection }}
        onRowSelectionChange={setRowSelection}
      />
      <p className="text-sm text-muted-foreground">Default mailer: {chosen ? chosen.name : "none"}</p>
    </div>
  )
}
