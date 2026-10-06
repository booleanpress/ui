import { Label } from "@booleanpress/ui/label"
import { TreeSelect } from "@booleanpress/ui/tree-select"
import type { TreeNode } from "@booleanpress/ui/tree"

const CATEGORIES: TreeNode[] = [
  { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices" }, { id: "refunds", label: "Refunds" }] },
  {
    id: "delivery",
    label: "Email delivery",
    children: [{ id: "smtp", label: "SMTP errors" }, { id: "bounces", label: "Bounces" }, { id: "spam", label: "Spam folder" }],
  },
  { id: "account", label: "Account", children: [{ id: "login", label: "Signing in" }, { id: "team", label: "Team members" }] },
]

export default function TreeSelectBasic() {
  return (
    <div className="flex w-full flex-col gap-2 md:w-64">
      <Label htmlFor="ticket-category">Category</Label>
      <TreeSelect id="ticket-category" nodes={CATEGORIES} placeholder="Choose a category" fluid />
    </div>
  )
}
