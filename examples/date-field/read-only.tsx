import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"

export default function DateFieldReadOnly() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="signup-label">Customer since</Label>
      <DateField aria-labelledby="signup-label" readOnly defaultValue={new Date(2026, 2, 9)} />
    </div>
  )
}
