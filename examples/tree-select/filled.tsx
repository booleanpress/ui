import { Label } from "@booleanpress/ui/label"
import { TreeSelect } from "@booleanpress/ui/tree-select"
import type { TreeNode } from "@booleanpress/ui/tree"

const CATEGORIES: TreeNode[] = [
  { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices" }, { id: "refunds", label: "Refunds" }] },
  { id: "delivery", label: "Email delivery", children: [{ id: "smtp", label: "SMTP errors" }, { id: "bounces", label: "Bounces" }] },
]

export default function TreeSelectFilled() {
  return (
    <div className="flex w-full flex-col gap-2 md:w-64">
      <Label htmlFor="filled-category">Category</Label>
      <TreeSelect id="filled-category" variant="filled" nodes={CATEGORIES} placeholder="Choose a category" fluid />
    </div>
  )
}
