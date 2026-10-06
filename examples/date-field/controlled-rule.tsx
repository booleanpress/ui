import * as React from "react"
import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"

export default function DateFieldControlledRule() {
  const [value, setValue] = React.useState<Date | null>(new Date(2026, 9, 9))
  const [refused, setRefused] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label id="delivery-day-label">Delivery day</Label>
      <DateField
        aria-labelledby="delivery-day-label"
        aria-describedby="delivery-day-note"
        value={value}
        onValueChange={(next) => {
          // The parent decides: a weekend is refused, and the field stays on the day it had.
          const weekend = next !== null && (next.getDay() === 0 || next.getDay() === 6)
          setRefused(weekend)
          if (!weekend) setValue(next)
        }}
      />
      <p id="delivery-day-note" className="text-sm text-muted-foreground">
        {refused ? "Weekends are not allowed." : "Monday to Friday only."}
      </p>
    </div>
  )
}
