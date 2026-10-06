import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"
import type { TreeNode } from "@booleanpress/ui/tree"

type Log = { status: string; sent: string }

const email = (id: string, label: string, status: string, sent: string): TreeNode<Log> => ({ id, label, data: { status, sent } })

const CAMPAIGNS: TreeNode<Log>[] = [
  {
    id: "october",
    label: "October newsletter",
    data: { status: "Sent", sent: "1 Oct 2026" },
    children: [email("oct-eu", "Europe list", "Sent", "1 Oct 2026"), email("oct-us", "United States list", "Sent", "1 Oct 2026")],
  },
  {
    id: "launch",
    label: "Product launch",
    data: { status: "Partly sent", sent: "3 Oct 2026" },
    children: [email("launch-vip", "VIP customers", "Sent", "3 Oct 2026"), email("launch-all", "All customers", "Queued", "—"), email("launch-trial", "Trial users", "Failed", "3 Oct 2026")],
  },
  { id: "receipts", label: "Order receipts", data: { status: "Sending", sent: "Daily" }, children: [email("receipts-shop", "Shop orders", "Sending", "Daily")] },
]

const COLUMNS: TreeTableColumn<Log>[] = [
  { id: "name", header: "Campaign" },
  { id: "status", header: "Status" },
  { id: "sent", header: "Sent" },
]

export default function TreeTableStriped() {
  return <TreeTable aria-label="Campaigns" nodes={CAMPAIGNS} columns={COLUMNS} striped defaultExpanded={["october", "launch"]} className="max-w-3xl" />
}
