import { DatePicker } from "@booleanpress/ui/date-picker"
import { FloatLabel } from "@booleanpress/ui/float-label"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerFloatLabel() {
  return (
    <div className="flex flex-col gap-8 pt-4.5">
      <FloatLabel>
        <DatePicker id="fl-renewal" today={new Date(2026, 9, 3)} />
        <Label htmlFor="fl-renewal">Renewal date</Label>
      </FloatLabel>
      <FloatLabel>
        <DatePicker id="fl-started" defaultValue={new Date(2026, 9, 1)} today={new Date(2026, 9, 3)} />
        <Label htmlFor="fl-started">Plan started</Label>
      </FloatLabel>
    </div>
  )
}
