import { ClockIcon } from "lucide-react"
import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

const today = new Date(2026, 9, 3)

export default function DatePickerIcon() {
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="trigger-button">Button</Label>
        <DatePicker id="trigger-button" trigger="button" today={today} fluid />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="trigger-icon">Icon in the field</Label>
        <DatePicker id="trigger-icon" trigger="icon" today={today} fluid />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="trigger-custom">Custom icon</Label>
        <DatePicker id="trigger-custom" trigger="icon" icon={<ClockIcon aria-hidden="true" />} today={today} fluid />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="trigger-field">The field opens it</Label>
        <DatePicker id="trigger-field" trigger="field" today={today} fluid />
      </div>
    </div>
  )
}
