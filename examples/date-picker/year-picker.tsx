import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerYearPicker() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="report-year">Annual report year</Label>
      <DatePicker id="report-year" view="year" defaultValue={new Date(2026, 0, 1)} today={new Date(2026, 9, 3)} />
    </div>
  )
}
