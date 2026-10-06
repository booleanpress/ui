import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerWeekNumbers() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="week-date">Planning date</Label>
      <DatePicker id="week-date" today={new Date(2026, 9, 14)} calendarProps={{ showWeekNumber: true, ISOWeek: true }} />
    </div>
  )
}
