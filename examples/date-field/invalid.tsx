import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"

export default function DateFieldInvalid() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="due-label">Payment due</Label>
      <DateField aria-labelledby="due-label" aria-invalid aria-describedby="due-error" />
      <p id="due-error" className="text-sm text-destructive-strong">
        Enter the day the payment is due.
      </p>
    </div>
  )
}
