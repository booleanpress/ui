import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldSeconds() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="retry-label">Retry the webhook at</Label>
      <TimeField aria-labelledby="retry-label" hourCycle={24} showSeconds defaultValue={new Date(2026, 9, 14, 8, 15, 30)} />
    </div>
  )
}
