import { useEffect, useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Tree, type TreeNode } from "@booleanpress/ui/tree"

const FOLDERS: TreeNode[] = [
  { id: "inbox", label: "Inbox", children: [{ id: "billing", label: "Billing" }, { id: "support", label: "Support" }] },
  { id: "sent", label: "Sent", children: [{ id: "receipts", label: "Receipts" }] },
  { id: "archive", label: "Archive", children: [{ id: "archive-2026", label: "2026" }] },
]

export default function TreeLoading() {
  const [loading, setLoading] = useState(false)

  // A pretend refresh that answers after 1.5 seconds; leaving the page cancels it.
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <div className="flex flex-1 flex-col items-end gap-2">
        <Button size="sm" onClick={() => setLoading(true)}>
          <RefreshCwIcon />
          Refresh
        </Button>
        <Tree aria-label="Mail folders" nodes={FOLDERS} defaultExpanded={["inbox"]} loading={loading} className="w-full" />
      </div>
      <Tree aria-label="Mail folders, first load" nodes={[]} loading className="flex-1" />
    </div>
  )
}
