import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"

export default function DateFieldWithForm() {
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
        <Label id="send-on-label">Send on</Label>
        <DateField aria-labelledby="send-on-label" name="day" defaultValue={new Date(2026, 9, 5)} />
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
