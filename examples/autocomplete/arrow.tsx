import { Autocomplete, AutocompleteArrow, AutocompleteContent, AutocompleteInput, AutocompleteItem, AutocompleteList } from "@booleanpress/ui/autocomplete"

const CITIES = ["Berlin", "Boston", "Brisbane", "Brussels"]

export default function AutocompleteArrowExample() {
  return <div className="w-56"><Autocomplete items={CITIES} openOnInputClick>
    <AutocompleteInput aria-label="City" placeholder="Find a city" />
    <AutocompleteContent sideOffset={8}>
      <AutocompleteArrow />
      <AutocompleteList>{(city: string) => <AutocompleteItem key={city} value={city}>{city}</AutocompleteItem>}</AutocompleteList>
    </AutocompleteContent>
  </Autocomplete></div>
}
