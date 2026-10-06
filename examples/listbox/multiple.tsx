import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

const EVENTS = ["Delivered", "Bounced", "Complained", "Opened", "Clicked"]

export default function ListboxMultiple() {
  const [events, setEvents] = useState(["Bounced", "Complained"])

  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label id="listbox-events-label">Webhook events</Label>
      <Listbox aria-labelledby="listbox-events-label" multiple value={events} onValueChange={setEvents}>
        {EVENTS.map((event) => (
          <ListboxItem key={event} value={event}>
            {event}
          </ListboxItem>
        ))}
      </Listbox>
      <p className="text-xs text-muted-foreground">{events.length ? `Sending ${events.join(", ").toLowerCase()}.` : "Sending nothing."}</p>
    </div>
  )
}
