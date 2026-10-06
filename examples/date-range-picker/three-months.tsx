import { DateRangePicker } from "@booleanpress/ui/date-range-picker"

export default function DateRangePickerThreeMonths() {
  return <DateRangePicker inline aria-label="Quarterly report period" presets={false} numberOfMonths={3}
    defaultMonth={new Date(2026, 9, 1)} today={new Date(2026, 9, 14)} />
}
