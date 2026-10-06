import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

const CATEGORIES = [
  { value: "billing", label: "Billing" },
  { value: "delivery", label: "Delivery" },
  { value: "integrations", label: "Integrations" },
  { value: "account", label: "Account" },
]

export default function SelectClear() {
  const [category, setCategory] = useState("delivery")
  const chosen = CATEGORIES.find((item) => item.value === category)

  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="ticket-category">Ticket category</Label>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger id="ticket-category" clearable className="w-full">
          <SelectValue placeholder="Any category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {chosen ? `Showing ${chosen.label.toLowerCase()} tickets.` : "Showing every ticket."}
      </p>
    </div>
  )
}
