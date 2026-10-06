import { Button } from "@booleanpress/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@booleanpress/ui/sheet"

const EVENTS = Array.from({ length: 30 }, (_, i) => `Delivery attempt ${i + 1}: accepted by the mail server`)

export default function SheetLongContent() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open the delivery history</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Delivery history</SheetTitle>
          <SheetDescription>Every attempt for this email, newest last.</SheetDescription>
        </SheetHeader>
        <ol className="flex-1 overflow-y-auto px-4.5 text-sm">
          {EVENTS.map((event) => (
            <li key={event} className="border-b py-2">
              {event}
            </li>
          ))}
        </ol>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close history</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
