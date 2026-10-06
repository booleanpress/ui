import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerWithForm() {
  const [sent, setSent] = React.useState("")

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {/* The picker sits outside the form and belongs to it through `form`. */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="schedule-day">Send on</Label>
        <DatePicker id="schedule-day" name="day" form="schedule" defaultValue={new Date(2026, 9, 5)} />
      </div>
      <form
        id="schedule"
        className="flex gap-2 rounded-md border p-3"
        onSubmit={(event) => {
          event.preventDefault()
          setSent([...new FormData(event.currentTarget)].map(([key, value]) => `${key} = ${value}`).join(", "))
        }}
      >
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </form>
      <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs whitespace-pre-wrap text-foreground">{sent ? `Sent: ${sent}` : "Press Submit to see what the form sends."}</pre>
    </div>
  )
}
