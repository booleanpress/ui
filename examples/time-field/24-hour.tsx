import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeField24Hour() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="cutoff-label">Daily sending cut-off</Label>
      <TimeField aria-labelledby="cutoff-label" hourCycle={24} defaultValue={new Date(2026, 9, 14, 17, 45)} />
    </div>
  )
}
