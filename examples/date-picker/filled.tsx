import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerFilled() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="ticket-due">Ticket due</Label>
      <DatePicker id="ticket-due" variant="filled" defaultValue={new Date(2026, 9, 21)} today={new Date(2026, 9, 3)} />
    </div>
  )
}
