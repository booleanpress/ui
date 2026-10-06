import { useState } from "react"
import { Autocomplete, AutocompleteContent, AutocompleteInput, AutocompleteItem, AutocompleteList } from "@booleanpress/ui/autocomplete"

const COUNTRIES = ["Australia", "Brazil", "Canada", "Denmark", "France", "Germany"]

export default function AutocompleteForceSelection() {
  const [value, setValue] = useState("")
  return <div className="flex w-56 flex-col gap-2">
    <Autocomplete items={COUNTRIES} value={value} onValueChange={setValue}>
      <AutocompleteInput aria-label="Country" placeholder="Choose a country" onBlur={() => {
        const match = COUNTRIES.find((country) => country.toLowerCase() === value.trim().toLowerCase())
        setValue(match ?? "")
      }} />
      <AutocompleteContent><AutocompleteList>{(country: string) => <AutocompleteItem key={country} value={country}>{country}</AutocompleteItem>}</AutocompleteList></AutocompleteContent>
    </Autocomplete>
    <p className="text-xs text-muted-foreground">Choose a suggestion; unmatched text is cleared when you leave the field.</p>
  </div>
}
