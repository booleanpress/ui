import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldBasic() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="digest-time-label">Send the daily digest at</Label>
      <TimeField aria-labelledby="digest-time-label" defaultValue={new Date(2026, 9, 14, 9, 30)} />
    </div>
  )
}
