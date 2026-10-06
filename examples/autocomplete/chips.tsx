import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@booleanpress/ui/combobox"

const EVENTS = ["Delivered", "Bounced", "Complained", "Opened", "Clicked", "Unsubscribed", "Deferred", "Failed"]

export default function AutocompleteChips() {
  const anchor = useComboboxAnchor()

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="autocomplete-events">Webhook events</Label>
      <Combobox items={EVENTS} multiple defaultValue={["Bounced", "Complained"]}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(events: string[]) => (
              <>
                {events.map((event) => (
                  <ComboboxChip key={event}>{event}</ComboboxChip>
                ))}
                <ComboboxChipsInput id="autocomplete-events" placeholder={events.length ? "" : "Add events"} />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty />
          <ComboboxList>
            {(event: string) => (
              <ComboboxItem key={event} value={event}>
                {event}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
