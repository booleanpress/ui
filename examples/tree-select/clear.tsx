import { Label } from "@booleanpress/ui/label"
import { TreeSelect } from "@booleanpress/ui/tree-select"
import type { TreeNode } from "@booleanpress/ui/tree"

const CATEGORIES: TreeNode[] = [
  { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices" }, { id: "refunds", label: "Refunds" }] },
  { id: "delivery", label: "Email delivery", children: [{ id: "smtp", label: "SMTP errors" }, { id: "bounces", label: "Bounces" }] },
]

export default function TreeSelectClear() {
  return (
    <div className="flex w-full flex-col gap-2 md:w-64">
      <Label htmlFor="filter-category">Filter by category</Label>
      <TreeSelect id="filter-category" nodes={CATEGORIES} defaultValue={["bounces"]} placeholder="Any category" clearable fluid />
    </div>
  )
}
