import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerTwoMonths() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="renewal-date">Renewal date</Label>
      <DatePicker id="renewal-date" numberOfMonths={2} defaultMonth={new Date(2026, 9)} today={new Date(2026, 9, 3)} />
    </div>
  )
}
