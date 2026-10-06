import { DateRangePicker } from "@booleanpress/ui/date-range-picker"

const week = { from: new Date(2026, 9, 5), to: new Date(2026, 9, 11) }
const today = new Date(2026, 9, 14)

export default function DateRangePickerSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      <DateRangePicker size="sm" aria-label="Small" defaultValue={week} today={today} className="w-56" />
      <DateRangePicker aria-label="Default" defaultValue={week} today={today} className="w-60" />
      <DateRangePicker size="lg" aria-label="Large" defaultValue={week} today={today} className="w-64" />
    </div>
  )
}
