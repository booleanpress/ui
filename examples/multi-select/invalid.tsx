import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const EVENTS = ["Delivered", "Bounced", "Complained", "Opened", "Clicked"]

export default function MultiSelectInvalid() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="multi-select-invalid">Webhook events</Label>
      <MultiSelect items={EVENTS} required>
        <MultiSelectTrigger id="multi-select-invalid" className="w-full" aria-invalid aria-describedby="multi-select-invalid-error">
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
      <p id="multi-select-invalid-error" className="text-xs text-destructive-strong">
        Choose at least one event to send.
      </p>
    </div>
  )
}
