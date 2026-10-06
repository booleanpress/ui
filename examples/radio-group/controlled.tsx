import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

const PRIORITIES = ["low", "normal", "high", "urgent"]

export default function RadioGroupControlled() {
  const [priority, setPriority] = useState("normal")

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup value={priority} onValueChange={setPriority} aria-label="Ticket priority">
        {PRIORITIES.map((value) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem id={`priority-${value}`} value={value} />
            <Label htmlFor={`priority-${value}`} className="capitalize">
              {value}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-sm text-muted-foreground">Priority: {priority}</p>
    </div>
  )
}
