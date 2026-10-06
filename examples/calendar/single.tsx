import { useState } from "react"
import { Calendar } from "@booleanpress/ui/calendar"

export default function CalendarSingle() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 14))

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 9)}
      today={new Date(2026, 9, 3)}
    />
  )
}
