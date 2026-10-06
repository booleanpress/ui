import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerMonthPicker() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="billing-month">Billing month</Label>
      <DatePicker id="billing-month" view="month" defaultValue={new Date(2026, 9, 1)} today={new Date(2026, 9, 3)} />
    </div>
  )
}
