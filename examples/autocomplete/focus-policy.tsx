import { useState } from "react"
import { Autocomplete, AutocompleteContent, AutocompleteInput, AutocompleteItem, AutocompleteList } from "@booleanpress/ui/autocomplete"

const CITIES = ["Berlin", "Boston", "Brisbane", "Brussels"]

export default function AutocompleteFocusPolicy() {
  const [open, setOpen] = useState(false)
  return <div className="w-56"><Autocomplete items={CITIES} defaultValue="B" open={open} onOpenChange={setOpen} autoHighlight="always" highlightItemOnHover={false}>
    <AutocompleteInput aria-label="City" onFocus={(event) => { event.currentTarget.select(); setOpen(true) }} />
    <AutocompleteContent><AutocompleteList>{(city: string) => <AutocompleteItem key={city} value={city}>{city}</AutocompleteItem>}</AutocompleteList></AutocompleteContent>
  </Autocomplete></div>
}
