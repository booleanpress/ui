import { useState } from "react"
import { Tree, type TreeNode } from "@booleanpress/ui/tree"

const EVENTS: TreeNode[] = [
  {
    id: "delivery",
    label: "Delivery",
    children: [
      { id: "sent", label: "Sent" },
      { id: "delivered", label: "Delivered" },
      { id: "bounced", label: "Bounced" },
    ],
  },
  { id: "engagement", label: "Engagement", children: [{ id: "opened", label: "Opened" }, { id: "clicked", label: "Clicked" }] },
  { id: "complaints", label: "Spam complaints" },
]

export default function TreeCheckboxSelection() {
  const [checked, setChecked] = useState(["delivered"])

  return (
    <div className="flex w-full flex-col gap-2 md:w-120">
      <Tree
        aria-label="Webhook events"
        nodes={EVENTS}
        selectionMode="checkbox"
        selected={checked}
        onSelectedChange={setChecked}
        defaultExpanded={["delivery"]}
      />
      <p className="text-sm text-muted-foreground">Sending {checked.length} {checked.length === 1 ? "event" : "events"} to the webhook.</p>
    </div>
  )
}
