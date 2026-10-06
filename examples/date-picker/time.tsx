import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

const today = new Date(2026, 9, 3)

export default function DatePickerTime() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="send-at-12">Send at (12-hour)</Label>
        <DatePicker id="send-at-12" showTime hourCycle={12} defaultValue={new Date(2026, 9, 14, 9, 30)} today={today} className="w-60" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="send-at-24">Send at (24-hour)</Label>
        <DatePicker id="send-at-24" showTime hourCycle={24} defaultValue={new Date(2026, 9, 14, 17, 45)} today={today} className="w-60" />
      </div>
    </div>
  )
}
