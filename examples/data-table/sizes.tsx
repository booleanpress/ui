import { useState } from "react"
import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"
import { SegmentedControl, SegmentedControlItem } from "@booleanpress/ui/segmented-control"

type Ticket = { id: string; subject: string; requester: string; priority: string }

const TICKETS: Ticket[] = [
  { id: "t-2081", subject: "Cannot connect to SES", requester: "Ana Ruiz", priority: "High" },
  { id: "t-2080", subject: "Invoice is missing a VAT number", requester: "Li Wei", priority: "Normal" },
  { id: "t-2079", subject: "Import stops at row 200", requester: "Sam Okoye", priority: "High" },
  { id: "t-2078", subject: "Change the sender name", requester: "Kim Park", priority: "Low" },
  { id: "t-2077", subject: "Webhook retries twice", requester: "Noor Haddad", priority: "Normal" },
]

const COLUMNS: DataTableColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "Ticket" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "requester", header: "Requester" },
  { accessorKey: "priority", header: "Priority" },
]

export default function DataTableSizes() {
  const [size, setSize] = useState<"sm" | "default" | "lg">("default")

  return (
    <div className="flex w-full flex-col gap-4">
      <SegmentedControl value={size} onValueChange={(value) => setSize(value as typeof size)} aria-label="Table size" className="self-start">
        <SegmentedControlItem value="sm">Small</SegmentedControlItem>
        <SegmentedControlItem value="default">Normal</SegmentedControlItem>
        <SegmentedControlItem value="lg">Large</SegmentedControlItem>
      </SegmentedControl>
      <DataTable aria-label="Open tickets" size={size} columns={COLUMNS} data={TICKETS} getRowId={(row) => row.id} />
    </div>
  )
}
