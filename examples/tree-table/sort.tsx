import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"
import type { TreeNode } from "@booleanpress/ui/tree"

type Member = { role: string; tickets: number }

const person = (id: string, label: string, role: string, tickets: number): TreeNode<Member> => ({ id, label, data: { role, tickets } })

const ORGANISATIONS: TreeNode<Member>[] = [
  {
    id: "northwind",
    label: "Northwind Agency",
    data: { role: "Organisation", tickets: 14 },
    children: [person("amara", "Amara Okafor", "Support lead", 5), person("jonas", "Jonas Berg", "Support agent", 4), person("lena", "Lena Fischer", "Accountant", 5)],
  },
  { id: "acme", label: "Acme Hosting", data: { role: "Organisation", tickets: 7 }, children: [person("ravi", "Ravi Patel", "Engineer", 7)] },
  { id: "globex", label: "Globex Shop", data: { role: "Organisation", tickets: 2 }, children: [person("sam", "Sam Rivera", "Store manager", 2)] },
]

const COLUMNS: TreeTableColumn<Member>[] = [
  { id: "name", header: "Name", sortable: true },
  { id: "role", header: "Role", sortable: true },
  { id: "tickets", header: "Open tickets", sortable: true },
]

export default function TreeTableSort() {
  return (
    <TreeTable
      aria-label="Organisations"
      nodes={ORGANISATIONS}
      columns={COLUMNS}
      defaultSort={{ id: "tickets", desc: true }}
      defaultExpanded={["northwind"]}
      className="max-w-3xl"
    />
  )
}
