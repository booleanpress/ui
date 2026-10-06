import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerBasic() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="send-on">Send the newsletter on</Label>
      <DatePicker id="send-on" defaultValue={new Date(2026, 9, 14)} today={new Date(2026, 9, 3)} />
    </div>
  )
}
