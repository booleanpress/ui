import { Button } from "@booleanpress/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@booleanpress/ui/drawer"

const EVENTS = Array.from({ length: 30 }, (_, index) => ({
  id: 1040 + index,
  to: `customer${index + 1}@example.com`,
  status: index % 9 === 4 ? "Bounced" : "Delivered",
  time: `09:${String(index * 2).padStart(2, "0")}`,
}))

export default function DrawerScrollable() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open the delivery log</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delivery log</DrawerTitle>
          <DrawerDescription>30 messages sent this morning, 4 October 2026.</DrawerDescription>
        </DrawerHeader>
        <ul className="min-h-0 flex-1 divide-y overflow-y-auto px-4.5 text-sm/normal">
          {EVENTS.map((event) => (
            <li key={event.id} className="flex items-center justify-between gap-4 py-2">
              <span className="truncate">{event.to}</span>
              <span className="shrink-0 text-muted-foreground tabular-nums">
                {event.status} · {event.time}
              </span>
            </li>
          ))}
        </ul>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
