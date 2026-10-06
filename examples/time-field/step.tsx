import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldStep() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="slot-label">Support call slot (every 15 minutes)</Label>
      <TimeField aria-labelledby="slot-label" step={15} defaultValue={new Date(2026, 9, 14, 14, 0)} />
    </div>
  )
}
