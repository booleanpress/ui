import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"

export default function DateFieldDisabled() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="joined-label">Customer since</Label>
      <DateField aria-labelledby="joined-label" disabled defaultValue={new Date(2026, 2, 9)} />
    </div>
  )
}
