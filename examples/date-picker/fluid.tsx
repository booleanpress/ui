import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerFluid() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor="trial-ends">Trial ends</Label>
      <DatePicker id="trial-ends" fluid defaultValue={new Date(2026, 9, 31)} today={new Date(2026, 9, 3)} />
    </div>
  )
}
