import { DatePicker } from "@booleanpress/ui/date-picker"

const today = new Date(2026, 9, 3)

export default function DatePickerSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      <DatePicker size="sm" aria-label="Small" placeholder="Small" today={today} />
      <DatePicker aria-label="Default" placeholder="Default" today={today} />
      <DatePicker size="lg" aria-label="Large" placeholder="Large" today={today} />
    </div>
  )
}
