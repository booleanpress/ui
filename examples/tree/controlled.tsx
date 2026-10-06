import { useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Tree, getExpandableIds, type TreeNode } from "@booleanpress/ui/tree"

const FOLDERS: TreeNode[] = [
  {
    id: "inbox",
    label: "Inbox",
    children: [
      { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices" }, { id: "refunds", label: "Refunds" }] },
      { id: "support", label: "Support", children: [{ id: "open", label: "Open tickets" }] },
    ],
  },
  { id: "sent", label: "Sent", children: [{ id: "receipts", label: "Receipts" }] },
  { id: "archive", label: "Archive", children: [{ id: "archive-2026", label: "2026" }] },
]

export default function TreeControlled() {
  const [expanded, setExpanded] = useState<string[]>([])

  return (
    <div className="flex w-full flex-col gap-2 md:w-120">
      <div className="flex gap-2">
        <Button onClick={() => setExpanded(getExpandableIds(FOLDERS))}>
          <PlusIcon />
          Expand all
        </Button>
        <Button variant="outline" onClick={() => setExpanded([])}>
          <MinusIcon />
          Collapse all
        </Button>
      </div>
      <Tree aria-label="Mail folders" nodes={FOLDERS} expanded={expanded} onExpandedChange={setExpanded} />
    </div>
  )
}
