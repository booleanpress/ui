import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"
import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"
import type { TreeNode } from "@booleanpress/ui/tree"

type Member = { role: string; tickets: number }

const ORGANISATIONS: TreeNode<Member>[] = [
  {
    id: "northwind",
    label: "Northwind Agency",
    data: { role: "Organisation", tickets: 14 },
    children: [
      { id: "nw-support", label: "Support", data: { role: "Team", tickets: 9 } },
      { id: "nw-billing", label: "Billing", data: { role: "Team", tickets: 5 } },
    ],
  },
  { id: "acme", label: "Acme Hosting", data: { role: "Organisation", tickets: 7 }, children: [{ id: "acme-eng", label: "Engineering", data: { role: "Team", tickets: 7 } }] },
]

const COLUMNS: TreeTableColumn<Member>[] = [
  { id: "name", header: "Name" },
  { id: "role", header: "Role" },
  { id: "tickets", header: "Open tickets" },
]

export default function TreeTableSizes() {
  const [size, setSize] = useState<"sm" | "default" | "lg">("default")

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <ToggleGroup type="single" variant="outline" value={size} onValueChange={(next) => next && setSize(next as typeof size)} aria-label="Row size">
        <ToggleGroupItem value="sm">Small</ToggleGroupItem>
        <ToggleGroupItem value="default">Default</ToggleGroupItem>
        <ToggleGroupItem value="lg">Large</ToggleGroupItem>
      </ToggleGroup>
      <TreeTable aria-label="Organisations" nodes={ORGANISATIONS} columns={COLUMNS} size={size} defaultExpanded={["northwind"]} />
    </div>
  )
}
