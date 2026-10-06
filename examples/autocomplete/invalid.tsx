import { Label } from "@booleanpress/ui/label"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@booleanpress/ui/autocomplete"

const DOMAINS = ["example.com", "mail.example.com", "news.example.com"]

export default function AutocompleteInvalid() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="autocomplete-domain">Sending domain</Label>
      <Autocomplete items={DOMAINS} required>
        <AutocompleteInput
          id="autocomplete-domain"
          placeholder="example.com"
          aria-invalid
          aria-describedby="autocomplete-domain-error"
        />
        <AutocompleteContent>
          <AutocompleteList>
            {(domain: string) => (
              <AutocompleteItem key={domain} value={domain}>
                {domain}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <p id="autocomplete-domain-error" className="text-xs text-destructive-strong">
        Enter the domain you send from.
      </p>
    </div>
  )
}
