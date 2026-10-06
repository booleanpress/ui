import { useState } from "react"
import { Calendar } from "@booleanpress/ui/calendar"

export default function CalendarDisabledDates() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 9)}
      today={new Date(2026, 9, 3)}
      disabled={[{ before: new Date(2026, 9, 3) }, { dayOfWeek: [0, 6] }]}
    />
  )
}
