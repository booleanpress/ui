import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { TreeSelect } from "@booleanpress/ui/tree-select"
import type { TreeNode } from "@booleanpress/ui/tree"

const EVENTS: TreeNode[] = [
  {
    id: "delivery",
    label: "Delivery",
    children: [{ id: "sent", label: "Sent" }, { id: "delivered", label: "Delivered" }, { id: "bounced", label: "Bounced" }],
  },
  { id: "engagement", label: "Engagement", children: [{ id: "opened", label: "Opened" }, { id: "clicked", label: "Clicked" }] },
  { id: "complaints", label: "Spam complaints" },
]

export default function TreeSelectCheckbox() {
  const [events, setEvents] = useState(["delivery", "sent", "delivered", "bounced"])

  return (
    <div className="flex w-full flex-col gap-2 md:w-64">
      <Label htmlFor="webhook-events">Webhook events</Label>
      <TreeSelect id="webhook-events" nodes={EVENTS} selectionMode="checkbox" value={events} onValueChange={setEvents} fluid />
      <p className="text-sm text-muted-foreground">{events.length} {events.length === 1 ? "event" : "events"} checked.</p>
    </div>
  )
}
