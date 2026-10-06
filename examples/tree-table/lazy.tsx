import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"
import type { TreeNode } from "@booleanpress/ui/tree"

type Member = { role: string; tickets: number }

const ORGANISATIONS: TreeNode<Member>[] = [
  { id: "northwind", label: "Northwind Agency", data: { role: "Organisation", tickets: 14 } },
  { id: "acme", label: "Acme Hosting", data: { role: "Organisation", tickets: 7 } },
  { id: "globex", label: "Globex Shop", data: { role: "Organisation", tickets: 2 } },
]

// A fake request: an organisation's teams arrive after 1.2 seconds; a team's people load the same way.
function loadChildren(node: TreeNode<Member>): Promise<TreeNode<Member>[]> {
  const teams = node.data?.role === "Organisation"
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          teams
            ? [
                { id: `${node.id}-support`, label: "Support", data: { role: "Team", tickets: 3 } },
                { id: `${node.id}-billing`, label: "Billing", data: { role: "Team", tickets: 1 } },
              ]
            : [{ id: `${node.id}-lead`, label: "Team lead", data: { role: "Person", tickets: 1 }, leaf: true }]
        ),
      1200
    )
  )
}

const COLUMNS: TreeTableColumn<Member>[] = [
  { id: "name", header: "Name" },
  { id: "role", header: "Role" },
  { id: "tickets", header: "Open tickets" },
]

export default function TreeTableLazy() {
  return <TreeTable aria-label="Organisations" nodes={ORGANISATIONS} columns={COLUMNS} loadChildren={loadChildren} className="max-w-3xl" />
}
