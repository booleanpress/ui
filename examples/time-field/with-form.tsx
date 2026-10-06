import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { Label } from "@booleanpress/ui/label"
import { TimeField } from "@booleanpress/ui/time-field"

export default function TimeFieldWithForm() {
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
        <Label id="send-at-label">Send at</Label>
        <TimeField aria-labelledby="send-at-label" name="time" defaultValue={new Date(2026, 9, 5, 9, 30)} />
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
