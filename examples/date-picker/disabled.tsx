import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerDisabled() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="created-on">Created on</Label>
      <DatePicker id="created-on" disabled defaultValue={new Date(2026, 9, 1)} today={new Date(2026, 9, 3)} />
    </div>
  )
}
