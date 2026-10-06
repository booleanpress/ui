import { useState } from "react"
import { MailIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { DataTable, DataTableRowActions, type DataTableColumnDef } from "@booleanpress/ui/data-table"
import { DropdownMenuItem } from "@booleanpress/ui/dropdown-menu"

type Ticket = { id: string; subject: string; requester: string; priority: "High" | "Normal" | "Low"; status: "Open" | "Pending" | "Solved"; updated: string }

const SUBJECTS = ["Cannot connect to SES", "Invoice is missing a VAT number", "Import stops at row 200", "Change the sender name", "Webhook retries twice", "Export to CSV is empty"]
const PEOPLE = ["Ana Ruiz", "Li Wei", "Sam Okoye", "Kim Park", "Noor Haddad", "Tom Becker", "Ines Costa"]
const TICKETS: Ticket[] = Array.from({ length: 36 }, (_, index) => ({
  id: `t-${2100 - index}`,
  subject: SUBJECTS[index % SUBJECTS.length],
  requester: PEOPLE[(index * 3) % PEOPLE.length],
  priority: (["High", "Normal", "Low"] as const)[(index * 5) % 3],
  status: (["Open", "Pending", "Solved"] as const)[index % 3],
  updated: `2026-10-${String(30 - (index % 28)).padStart(2, "0")}`,
}))

const TONE = { Open: "info", Pending: "warning", Solved: "success" } as const
const option = (value: string) => ({ label: value, value })

const COLUMNS: DataTableColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "Ticket", size: 110 },
  { accessorKey: "subject", header: "Subject", size: 260 },
  { accessorKey: "requester", header: "Requester", size: 160 },
  { accessorKey: "priority", header: "Priority", size: 140, meta: { filter: { variant: "select", placeholder: "Any", options: ["High", "Normal", "Low"].map(option) } } },
  {
    accessorKey: "status",
    header: "Status",
    size: 140,
    meta: { filter: { variant: "select", placeholder: "Any", options: ["Open", "Pending", "Solved"].map(option) } },
    cell: ({ row }) => <Badge variant={TONE[row.original.status]}>{row.original.status}</Badge>,
  },
  { accessorKey: "updated", header: "Updated", size: 130, enableColumnFilter: false },
  {
    id: "actions",
    size: 64,
    cell: ({ row }) => (
      <DataTableRowActions label={row.original.id}>
        <DropdownMenuItem>Open ticket</DropdownMenuItem>
        <DropdownMenuItem>Assign to me</DropdownMenuItem>
        <DropdownMenuItem>Close</DropdownMenuItem>
      </DataTableRowActions>
    ),
  },
]

export default function DataTableAdvanced() {
  const [rowSelection, setRowSelection] = useState<Record<string, true>>({})
  const selected = Object.keys(rowSelection).length

  return (
    <DataTable
      aria-label="Support tickets"
      sorting
      filtering
      pagination={{ pageSizes: [10, 20, 50], range: true }}
      selection="multiple"
      columnVisibility
      columnResizing
      exportCsv="tickets.csv"
      toolbar={
        <Button size="sm" variant="secondary" disabled={!selected}>
          <MailIcon />
          Email requesters
        </Button>
      }
      columns={COLUMNS}
      data={TICKETS}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.id}
      state={{ rowSelection }}
      onRowSelectionChange={setRowSelection}
      initialState={{ sorting: [{ id: "updated", desc: true }] }}
    />
  )
}
