import { ScrollArea } from "@booleanpress/ui/scroll-area"
import { Separator } from "@booleanpress/ui/separator"

const EVENTS = Array.from({ length: 20 }, (_, i) => `Email ${1000 + i} delivered to a recipient`)

export default function ScrollAreaVertical() {
  return (
    <ScrollArea className="h-56 w-64 rounded-md border">
      <div className="p-4">
        <h4 className="mb-3 text-sm font-medium">Recent events</h4>
        {EVENTS.map((event) => (
          <div key={event}>
            <div className="text-sm">{event}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
