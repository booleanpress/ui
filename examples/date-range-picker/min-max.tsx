import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerMinMax() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="retained-logs">Logs kept for 30 days</Label>
      <DateRangePicker
        id="retained-logs"
        min={new Date(2026, 8, 15)}
        max={new Date(2026, 9, 14)}
        today={new Date(2026, 9, 14)}
        placeholder="Choose dates"
        className="w-64"
      />
    </div>
  )
}
