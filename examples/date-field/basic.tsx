import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"

export default function DateFieldBasic() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="invoice-date-label">Invoice date</Label>
      <DateField aria-labelledby="invoice-date-label" defaultValue={new Date(2026, 9, 14)} />
    </div>
  )
}
