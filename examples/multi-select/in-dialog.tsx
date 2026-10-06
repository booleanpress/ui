import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@booleanpress/ui/dialog"
import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const EVENTS = ["Delivered", "Bounced", "Complained", "Opened", "Clicked", "Unsubscribed", "Deferred", "Failed"]

export default function MultiSelectInDialog() {
  const [events, setEvents] = useState(["Bounced", "Complained"])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit the webhook</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit the webhook</DialogTitle>
          <DialogDescription>Choose the events this endpoint receives.</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-2">
          <Label htmlFor="multi-select-webhook">Events</Label>
          <MultiSelect items={EVENTS} value={events} onValueChange={setEvents}>
            <MultiSelectTrigger id="multi-select-webhook" fluid>
              <MultiSelectValue display="chips" placeholder="Choose events" />
            </MultiSelectTrigger>
            <MultiSelectContent>
              <MultiSelectList>
                {(event: string) => (
                  <MultiSelectItem key={event} value={event}>
                    {event}
                  </MultiSelectItem>
                )}
              </MultiSelectList>
            </MultiSelectContent>
          </MultiSelect>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={events.length === 0}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
