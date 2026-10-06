import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@booleanpress/ui/calendar"

export default function CalendarRange() {
  const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2026, 9, 8), to: new Date(2026, 9, 15) })

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={new Date(2026, 9)}
      today={new Date(2026, 9, 3)}
    />
  )
}
