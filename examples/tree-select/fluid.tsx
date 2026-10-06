import { Label } from "@booleanpress/ui/label"
import { TreeSelect } from "@booleanpress/ui/tree-select"
import type { TreeNode } from "@booleanpress/ui/tree"

const CATEGORIES: TreeNode[] = [
  { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices" }, { id: "refunds", label: "Refunds" }] },
  { id: "delivery", label: "Email delivery", children: [{ id: "smtp", label: "SMTP errors" }, { id: "bounces", label: "Bounces" }] },
]

export default function TreeSelectFluid() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Label htmlFor="fluid-category">Category</Label>
      <TreeSelect id="fluid-category" nodes={CATEGORIES} placeholder="Choose a category" fluid />
    </div>
  )
}
