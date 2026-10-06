import { Label } from "@booleanpress/ui/label"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@booleanpress/ui/autocomplete"

const TAGS = ["billing", "bounce", "dkim", "dmarc", "dns", "feature request", "onboarding", "refund", "spf", "webhook"]

export default function AutocompleteBasic() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="autocomplete-tag">Ticket tag</Label>
      <Autocomplete items={TAGS}>
        <AutocompleteInput id="autocomplete-tag" placeholder="Type a tag" />
        <AutocompleteContent>
          <AutocompleteList>
            {(tag: string) => (
              <AutocompleteItem key={tag} value={tag}>
                {tag}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}
