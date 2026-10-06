import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerFilled() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="billing-period">Billing period</Label>
      <DateRangePicker
        id="billing-period"
        variant="filled"
        defaultValue={{ from: new Date(2026, 9, 1), to: new Date(2026, 9, 31) }}
        today={new Date(2026, 9, 14)}
        className="w-64"
      />
    </div>
  )
}
