import { Tree, type TreeNode } from "@booleanpress/ui/tree"

const FOLDERS: TreeNode[] = [
  {
    id: "inbox",
    label: "Inbox",
    children: [
      { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices" }, { id: "refunds", label: "Refunds" }] },
      { id: "support", label: "Support", children: [{ id: "open", label: "Open tickets" }, { id: "closed", label: "Closed tickets" }] },
    ],
  },
  { id: "sent", label: "Sent", children: [{ id: "receipts", label: "Receipts" }, { id: "newsletters", label: "Newsletters" }] },
  { id: "archive", label: "Archive", children: [{ id: "archive-2025", label: "2025" }, { id: "archive-2026", label: "2026" }] },
]

export default function TreeBasic() {
  return <Tree aria-label="Mail folders" nodes={FOLDERS} defaultExpanded={["inbox"]} className="w-full md:w-120" />
}
