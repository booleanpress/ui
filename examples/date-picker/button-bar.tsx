import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerButtonBar() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="export-from">Export logs from</Label>
      <DatePicker id="export-from" showButtonBar today={new Date(2026, 9, 3)} />
    </div>
  )
}
