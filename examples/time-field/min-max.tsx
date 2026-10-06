import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldMinMax() {
  const [time, setTime] = useState<Date | null>(new Date(2026, 9, 14, 18, 30))
  const late = time !== null && (time.getHours() > 17 || (time.getHours() === 17 && time.getMinutes() > 0))

  return (
    <div className="flex flex-col gap-2">
      <Label id="office-label">Callback time (9:00 to 17:00)</Label>
      <TimeField
        aria-labelledby="office-label"
        aria-describedby="office-hint"
        min={new Date(2026, 9, 14, 9, 0)}
        max={new Date(2026, 9, 14, 17, 0)}
        value={time}
        onValueChange={setTime}
      />
      <p id="office-hint" className={late ? "text-sm text-destructive-strong" : "text-sm text-muted-foreground"}>
        {late ? "Choose a time within office hours." : "Within office hours."}
      </p>
    </div>
  )
}
