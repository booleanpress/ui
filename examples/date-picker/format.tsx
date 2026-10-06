import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerFormat() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="invoice-date">Invoice date</Label>
        <DatePicker id="invoice-date" format="dd/MM/yyyy" defaultValue={new Date(2026, 9, 14)} today={new Date(2026, 9, 3)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="report-date">Report date</Label>
        <DatePicker
          id="report-date"
          format="EEE, d MMM yyyy"
          defaultValue={new Date(2026, 9, 14)}
          today={new Date(2026, 9, 3)}
          className="w-56"
        />
      </div>
    </div>
  )
}
