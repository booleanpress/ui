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

export default function TreeSelectMultiple() {
  return (
    <div className="flex w-full flex-col gap-2 md:w-64">
      <Label htmlFor="agent-categories">Categories this agent answers</Label>
      <TreeSelect
        id="agent-categories"
        nodes={CATEGORIES}
        selectionMode="multiple"
        defaultValue={["refunds", "bounces"]}
        placeholder="Choose categories"
        fluid
      />
    </div>
  )
}
