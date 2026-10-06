import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldInvalid() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="reminder-time-label">Reminder time</Label>
      <TimeField aria-labelledby="reminder-time-label" aria-invalid aria-describedby="reminder-time-error" />
      <p id="reminder-time-error" className="text-sm text-destructive-strong">
        Enter the time the reminder goes out.
      </p>
    </div>
  )
}
