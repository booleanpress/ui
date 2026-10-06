import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerClear() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="campaign-dates">Campaign dates</Label>
      <DateRangePicker
        id="campaign-dates"
        clearable
        defaultValue={{ from: new Date(2026, 9, 19), to: new Date(2026, 9, 25) }}
        today={new Date(2026, 9, 14)}
        placeholder="No dates"
        className="w-64"
      />
    </div>
  )
}
