import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerBasic() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="report-period">Report period</Label>
      <DateRangePicker
        id="report-period"
        presets={false}
        defaultValue={{ from: new Date(2026, 9, 1), to: new Date(2026, 9, 7) }}
        today={new Date(2026, 9, 14)}
        placeholder="Choose dates"
        className="w-64"
      />
    </div>
  )
}
