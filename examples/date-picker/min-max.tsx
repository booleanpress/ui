import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerMinMax() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="campaign-start">Campaign start (5 to 25 October)</Label>
      <DatePicker
        id="campaign-start"
        min={new Date(2026, 9, 5)}
        max={new Date(2026, 9, 25)}
        defaultMonth={new Date(2026, 9)}
        today={new Date(2026, 9, 3)}
      />
    </div>
  )
}
