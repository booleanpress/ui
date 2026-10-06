import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerDisabled() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="trial-period">Trial period</Label>
      <DateRangePicker
        id="trial-period"
        disabled
        defaultValue={{ from: new Date(2026, 9, 1), to: new Date(2026, 9, 14) }}
        today={new Date(2026, 9, 14)}
        className="w-64"
      />
    </div>
  )
}
