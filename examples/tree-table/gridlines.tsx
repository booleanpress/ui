import { Building2Icon, UserIcon, UsersIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"
import type { TreeNode } from "@booleanpress/ui/tree"

type Member = { kind: "Organisation" | "Team" | "Person"; tickets: number }

const person = (id: string, label: string, tickets: number): TreeNode<Member> => ({ id, label, icon: <UserIcon />, data: { kind: "Person", tickets } })
const team = (id: string, label: string, tickets: number, children: TreeNode<Member>[]): TreeNode<Member> => ({ id, label, icon: <UsersIcon />, data: { kind: "Team", tickets }, children })

const ORGANISATIONS: TreeNode<Member>[] = [
  {
    id: "northwind",
    label: "Northwind Agency",
    icon: <Building2Icon />,
    data: { kind: "Organisation", tickets: 14 },
    children: [team("nw-support", "Support", 9, [person("amara", "Amara Okafor", 5), person("jonas", "Jonas Berg", 4)]), team("nw-billing", "Billing", 5, [person("lena", "Lena Fischer", 5)])],
  },
  { id: "acme", label: "Acme Hosting", icon: <Building2Icon />, data: { kind: "Organisation", tickets: 7 }, children: [team("acme-eng", "Engineering", 7, [person("ravi", "Ravi Patel", 7)])] },
  { id: "globex", label: "Globex Shop", icon: <Building2Icon />, data: { kind: "Organisation", tickets: 2 }, children: [team("globex-ops", "Operations", 2, [person("sam", "Sam Rivera", 2)])] },
]

const COLUMNS: TreeTableColumn<Member>[] = [
  { id: "name", header: "Name" },
  { id: "tickets", header: "Open tickets" },
  {
    id: "kind",
    header: "Type",
    cell: (node) => <Badge variant={node.data?.kind === "Organisation" ? "warning" : node.data?.kind === "Team" ? "info" : "success"}>{node.data?.kind}</Badge>,
  },
]

export default function TreeTableGridlines() {
  return (
    <TreeTable aria-label="Organisations" nodes={ORGANISATIONS} columns={COLUMNS} gridlines defaultExpanded={["northwind"]} className="max-w-3xl" />
  )
}
