import { useState } from "react"
import { DateRangePicker, type DateRangeValue } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerPresets() {
  const [range, setRange] = useState<DateRangeValue | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="delivery-logs">Delivery logs</Label>
      <DateRangePicker
        id="delivery-logs"
        value={range}
        onValueChange={setRange}
        today={new Date(2026, 9, 14)}
        placeholder="All time"
        className="w-64"
      />
    </div>
  )
}
