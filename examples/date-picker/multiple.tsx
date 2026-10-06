import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerMultiple() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="digest-days">Digest days</Label>
      <DatePicker
        id="digest-days"
        mode="multiple"
        defaultValue={[new Date(2026, 9, 6), new Date(2026, 9, 13), new Date(2026, 9, 20)]}
        today={new Date(2026, 9, 3)}
        fluid
      />
    </div>
  )
}
