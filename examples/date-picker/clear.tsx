import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerClear() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="expires-on">API key expires on</Label>
      <DatePicker id="expires-on" clearable defaultValue={new Date(2026, 11, 31)} today={new Date(2026, 9, 3)} />
    </div>
  )
}
