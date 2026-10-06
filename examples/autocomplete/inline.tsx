import { Label } from "@booleanpress/ui/label"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@booleanpress/ui/autocomplete"

const ZONES = ["Africa/Cairo", "America/Chicago", "America/New_York", "Asia/Dhaka", "Asia/Tokyo", "Europe/Berlin", "Europe/London", "Europe/Madrid"]

export default function AutocompleteInline() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="autocomplete-zone">Time zone</Label>
      <Autocomplete items={ZONES} mode="both">
        <AutocompleteInput id="autocomplete-zone" placeholder="Europe/London" />
        <AutocompleteContent>
          <AutocompleteList>
            {(zone: string) => (
              <AutocompleteItem key={zone} value={zone}>
                {zone}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}
