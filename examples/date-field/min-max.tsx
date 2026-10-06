import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"

export default function DateFieldMinMax() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="launch-label">Launch date (October 2026)</Label>
      <DateField
        aria-labelledby="launch-label"
        aria-describedby="launch-hint"
        min={new Date(2026, 9, 1)}
        max={new Date(2026, 9, 31)}
        defaultValue={new Date(2026, 10, 3)}
      />
      <p id="launch-hint" className="text-sm text-muted-foreground">
        A date outside October marks the field invalid.
      </p>
    </div>
  )
}
