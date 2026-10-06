import { Building2Icon, PlusIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@booleanpress/ui/empty"
import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"

const COLUMNS: TreeTableColumn[] = [
  { id: "name", header: "Name" },
  { id: "role", header: "Role" },
  { id: "tickets", header: "Open tickets" },
]

export default function TreeTableEmpty() {
  return (
    <TreeTable
      aria-label="Organisations"
      nodes={[]}
      columns={COLUMNS}
      className="max-w-3xl"
      empty={
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2Icon />
            </EmptyMedia>
            <EmptyTitle>No organisations yet</EmptyTitle>
            <EmptyDescription>Add an organisation to group its teams and people.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">
              <PlusIcon />
              New organisation
            </Button>
          </EmptyContent>
        </Empty>
      }
    />
  )
}
