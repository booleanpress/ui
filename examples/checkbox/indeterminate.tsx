import { useState } from "react"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"

const EVENTS = [
  { id: "delivered", label: "Delivered" },
  { id: "bounced", label: "Bounced" },
  { id: "failed", label: "Failed" },
]

export default function CheckboxIndeterminate() {
  const [chosen, setChosen] = useState<string[]>(["bounced"])
  const all = chosen.length === EVENTS.length ? true : chosen.length > 0 ? "indeterminate" : false

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Notify me about</legend>
      <div className="flex items-center gap-2">
        <Checkbox
          id="events-all"
          checked={all}
          onCheckedChange={(checked) => setChosen(checked === true ? EVENTS.map((e) => e.id) : [])}
        />
        <Label htmlFor="events-all">All events</Label>
      </div>
      {EVENTS.map((event) => (
        <div key={event.id} className="ms-6.5 flex items-center gap-2">
          <Checkbox
            id={`events-${event.id}`}
            checked={chosen.includes(event.id)}
            onCheckedChange={(checked) =>
              setChosen((current) => (checked === true ? [...current, event.id] : current.filter((id) => id !== event.id)))
            }
          />
          <Label htmlFor={`events-${event.id}`}>{event.label}</Label>
        </div>
      ))}
    </fieldset>
  )
}
