import { Label } from "@booleanpress/ui/label"
import { TreeSelect } from "@booleanpress/ui/tree-select"
import type { TreeNode } from "@booleanpress/ui/tree"

const PAGES: TreeNode[] = [
  {
    id: "shop",
    label: "Shop",
    children: [
      { id: "cart", label: "Cart" },
      { id: "checkout", label: "Checkout", children: [{ id: "payment", label: "Payment" }, { id: "thank-you", label: "Thank you" }] },
    ],
  },
  { id: "account", label: "My account", children: [{ id: "orders", label: "Orders" }, { id: "addresses", label: "Addresses" }] },
  { id: "contact", label: "Contact us" },
]

export default function TreeSelectFilter() {
  return (
    <div className="flex w-full flex-col gap-2 md:w-64">
      <Label htmlFor="form-page">Show the form on</Label>
      <TreeSelect id="form-page" nodes={PAGES} filter filterPlaceholder="Search pages" placeholder="Choose a page" fluid />
    </div>
  )
}
