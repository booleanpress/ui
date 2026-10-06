import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"

export default function DateFieldFilled() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="renewal-label">Renewal date</Label>
      <DateField aria-labelledby="renewal-label" variant="filled" defaultValue={new Date(2026, 11, 1)} />
    </div>
  )
}
