import { InboxIcon, PlusIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@booleanpress/ui/empty"

type Mailer = { id: string; name: string; provider: string; status: string }

const COLUMNS: DataTableColumnDef<Mailer>[] = [
  { accessorKey: "name", header: "Mailer" },
  { accessorKey: "provider", header: "Provider" },
  { accessorKey: "status", header: "Status" },
]

const NONE: Mailer[] = []

export default function DataTableEmpty() {
  return (
    <DataTable
      aria-label="Mailers"
      columns={COLUMNS}
      data={NONE}
      empty={
        <Empty className="p-6 md:p-10">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-14 rounded-full bg-muted text-control-hover">
              <InboxIcon className="size-7" />
            </EmptyMedia>
            <EmptyTitle className="text-base font-semibold">No mailers yet</EmptyTitle>
            <EmptyDescription>Connect a mailer to start sending email.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">
              <PlusIcon />
              Add mailer
            </Button>
          </EmptyContent>
        </Empty>
      }
    />
  )
}
