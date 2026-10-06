import { Label } from "@booleanpress/ui/label"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@booleanpress/ui/autocomplete"

const SENDERS = ["Billing team", "Support team"]

export default function AutocompleteDisabled() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="autocomplete-sender">Sender name</Label>
      <Autocomplete items={SENDERS} defaultValue="Support team" disabled>
        <AutocompleteInput id="autocomplete-sender" disabled />
        <AutocompleteContent>
          <AutocompleteList>
            {(sender: string) => (
              <AutocompleteItem key={sender} value={sender}>
                {sender}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}
