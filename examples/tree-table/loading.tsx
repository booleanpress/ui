import { useEffect, useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
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

export default function TreeTableLoading() {
  const [loading, setLoading] = useState(false)

  // A pretend refresh that answers after 1.5 seconds; leaving the page cancels it.
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <div className="flex w-full max-w-3xl flex-col items-end gap-4">
      <Button size="sm" onClick={() => setLoading(true)}>
        <RefreshCwIcon />
        Refresh
      </Button>
      <TreeTable aria-label="Organisations" nodes={ORGANISATIONS} columns={COLUMNS} loading={loading} defaultExpanded={["northwind"]} />
      <TreeTable aria-label="Organisations, first load" nodes={[]} columns={COLUMNS} loading />
    </div>
  )
}
