import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldDisabled() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="backup-time-label">Nightly backup (set by your host)</Label>
      <TimeField aria-labelledby="backup-time-label" disabled defaultValue={new Date(2026, 9, 14, 2, 0)} />
    </div>
  )
}
