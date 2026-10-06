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

export default function MultiSelectBasic() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="multi-select-events">Webhook events</Label>
      <MultiSelect items={EVENTS}>
        <MultiSelectTrigger id="multi-select-events" className="w-full">
          <MultiSelectValue placeholder="Choose events" />
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
    </div>
  )
}
