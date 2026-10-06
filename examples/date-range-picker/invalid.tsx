import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerInvalid() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="audit-period">Audit period</Label>
      <DateRangePicker
        id="audit-period"
        aria-invalid
        aria-describedby="audit-period-error"
        today={new Date(2026, 9, 14)}
        placeholder="Choose dates"
        className="w-64"
      />
      <p id="audit-period-error" className="text-sm text-destructive-strong">
        Choose the first and last day to audit.
      </p>
    </div>
  )
}
