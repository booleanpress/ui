import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerActions() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="export-range">Export tickets created</Label>
      <DateRangePicker
        id="export-range"
        showActions
        defaultValue={{ from: new Date(2026, 8, 15), to: new Date(2026, 9, 14) }}
        today={new Date(2026, 9, 14)}
        className="w-64"
      />
    </div>
  )
}
