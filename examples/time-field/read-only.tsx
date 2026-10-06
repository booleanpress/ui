import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldReadOnly() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="report-time-label">Weekly report sent at</Label>
      <TimeField aria-labelledby="report-time-label" readOnly defaultValue={new Date(2026, 9, 14, 8, 30)} />
    </div>
  )
}
