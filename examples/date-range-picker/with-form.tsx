import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { DateRangePicker } from "@booleanpress/ui/date-range-picker"
import { Label } from "@booleanpress/ui/label"

export default function DateRangePickerWithForm() {
  const [sent, setSent] = React.useState("")

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setSent([...new FormData(event.currentTarget)].map(([key, value]) => `${key} = ${value}`).join(", "))
      }}
    >
      <div className="flex flex-col gap-2">
        <Label id="report-period-label">Report period</Label>
        <DateRangePicker
          aria-labelledby="report-period-label"
          name="range"
          clearable
          defaultValue={{ from: new Date(2026, 9, 5), to: new Date(2026, 9, 7) }}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs whitespace-pre-wrap text-foreground">{sent ? `Sent: ${sent}` : "Press Submit to see what the form sends."}</pre>
    </form>
  )
}
