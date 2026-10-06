import { useState } from "react"
import { CascadeSelect, type CascadeSelectOption } from "@booleanpress/ui/cascade-select"
import { Label } from "@booleanpress/ui/label"

const TOPICS: CascadeSelectOption[] = [
  {
    value: "billing",
    label: "Billing",
    children: [
      { value: "refund", label: "Refund" },
      { value: "invoice", label: "Invoice" },
    ],
  },
  {
    value: "delivery",
    label: "Delivery",
    children: [
      { value: "bounce", label: "Bounces" },
      { value: "spam", label: "Marked as spam" },
    ],
  },
]

export default function CascadeSelectClear() {
  const [topic, setTopic] = useState("bounce")
  const [topicLabel, setTopicLabel] = useState("Bounces")

  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="ticket-topic">Ticket topic</Label>
      <CascadeSelect
        id="ticket-topic"
        options={TOPICS}
        value={topic}
        onValueChange={(value, path) => {
          setTopic(value)
          setTopicLabel(path.at(-1)?.label ?? "")
        }}
        placeholder="Any topic"
        clearable
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">{topic ? `Showing ${topicLabel.toLowerCase()} tickets.` : "Showing every ticket."}</p>
    </div>
  )
}
