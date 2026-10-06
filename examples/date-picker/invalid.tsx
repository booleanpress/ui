import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerInvalid() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="go-live">Go-live date</Label>
      <DatePicker id="go-live" aria-invalid aria-describedby="go-live-error" today={new Date(2026, 9, 3)} />
      <p id="go-live-error" className="text-sm text-destructive-strong">
        Choose the day the mailer goes live.
      </p>
    </div>
  )
}
