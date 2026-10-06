import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldFilled() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="report-time-label">Weekly report time</Label>
      <TimeField aria-labelledby="report-time-label" variant="filled" defaultValue={new Date(2026, 9, 14, 7, 0)} />
    </div>
  )
}
