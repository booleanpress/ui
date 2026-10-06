import { TreeSelect } from "@booleanpress/ui/tree-select"
import type { TreeNode } from "@booleanpress/ui/tree"

const CATEGORIES: TreeNode[] = [
  { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices" }, { id: "refunds", label: "Refunds" }] },
  { id: "delivery", label: "Email delivery", children: [{ id: "smtp", label: "SMTP errors" }, { id: "bounces", label: "Bounces" }] },
]

export default function TreeSelectSizes() {
  return (
    <div className="flex w-full flex-col items-center gap-3 md:w-64">
      <TreeSelect aria-label="Category, small" size="sm" nodes={CATEGORIES} placeholder="Small" fluid />
      <TreeSelect aria-label="Category, default" nodes={CATEGORIES} placeholder="Default" fluid />
      <TreeSelect aria-label="Category, large" size="lg" nodes={CATEGORIES} placeholder="Large" fluid />
    </div>
  )
}
