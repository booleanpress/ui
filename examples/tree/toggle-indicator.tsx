import { CircleMinusIcon, CirclePlusIcon } from "lucide-react"
import { Tree, type TreeNode } from "@booleanpress/ui/tree"

const FOLDERS: TreeNode[] = [
  {
    id: "inbox",
    label: "Inbox",
    children: [
      { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices" }] },
      { id: "support", label: "Support", children: [{ id: "open", label: "Open tickets" }] },
    ],
  },
  { id: "sent", label: "Sent", children: [{ id: "receipts", label: "Receipts" }] },
  { id: "archive", label: "Archive", children: [{ id: "archive-2026", label: "2026" }] },
]

export default function TreeToggleIndicator() {
  return (
    <Tree
      aria-label="Mail folders"
      nodes={FOLDERS}
      defaultExpanded={["inbox"]}
      expandIcon={<CirclePlusIcon />}
      collapseIcon={<CircleMinusIcon />}
      className="w-full md:w-120"
    />
  )
}
