import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerRangeLength() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="traffic-report">Traffic report</Label>
      <DateRangePicker
        id="traffic-report"
        maxDays={14}
        today={new Date(2026, 9, 14)}
        placeholder="Choose dates"
        className="w-64"
      />
    </div>
  )
}
