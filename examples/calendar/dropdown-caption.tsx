import { useState } from "react"
import { Calendar } from "@booleanpress/ui/calendar"

export default function CalendarDropdownCaption() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 14))

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      startMonth={new Date(2024, 0)}
      endMonth={new Date(2028, 11)}
      defaultMonth={new Date(2026, 9)}
      today={new Date(2026, 9, 3)}
    />
  )
}
