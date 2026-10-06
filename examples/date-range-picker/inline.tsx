import { DateRangePicker } from "@booleanpress/ui/date-range-picker"

export default function DateRangePickerInline() {
  return <DateRangePicker inline aria-label="Report period" presets={false} numberOfMonths={1}
    defaultValue={{ from: new Date(2026, 9, 5), to: new Date(2026, 9, 9) }} today={new Date(2026, 9, 14)} />
}
