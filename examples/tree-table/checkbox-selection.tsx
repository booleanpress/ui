import { useState } from "react"
import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"
import type { TreeNode } from "@booleanpress/ui/tree"

type Member = { role: string; tickets: number }

const person = (id: string, label: string, role: string, tickets: number): TreeNode<Member> => ({ id, label, data: { role, tickets } })

const ORGANISATIONS: TreeNode<Member>[] = [
  {
    id: "northwind",
    label: "Northwind Agency",
    data: { role: "Organisation", tickets: 14 },
    children: [
      { id: "nw-support", label: "Support", data: { role: "Team", tickets: 9 }, children: [person("amara", "Amara Okafor", "Support lead", 5), person("jonas", "Jonas Berg", "Support agent", 4)] },
      { id: "nw-billing", label: "Billing", data: { role: "Team", tickets: 5 }, children: [person("lena", "Lena Fischer", "Accountant", 5)] },
    ],
  },
  { id: "acme", label: "Acme Hosting", data: { role: "Organisation", tickets: 7 }, children: [person("ravi", "Ravi Patel", "Engineer", 7)] },
]

const COLUMNS: TreeTableColumn<Member>[] = [
  { id: "name", header: "Name" },
  { id: "role", header: "Role" },
  { id: "tickets", header: "Open tickets" },
]

export default function TreeTableCheckboxSelection() {
  const [selected, setSelected] = useState(["amara"])

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2">
      <TreeTable
        aria-label="Recipients of the weekly report"
        nodes={ORGANISATIONS}
        columns={COLUMNS}
        selectionMode="checkbox"
        selected={selected}
        onSelectedChange={setSelected}
        defaultExpanded={["northwind", "nw-support"]}
      />
      <p className="text-sm text-muted-foreground">{selected.length} {selected.length === 1 ? "row" : "rows"} checked.</p>
    </div>
  )
}
