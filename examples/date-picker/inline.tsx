import { useState } from "react"
import { DatePicker } from "@booleanpress/ui/date-picker"

export default function DatePickerInline() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 14))

  return (
    <div className="flex flex-col items-start gap-3">
      <DatePicker inline aria-label="Publish date" value={date} onValueChange={setDate} today={new Date(2026, 9, 3)} />
      <p className="text-sm text-muted-foreground">
        Publishes on {date ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "no date yet"}.
      </p>
    </div>
  )
}
