import { Label } from "@booleanpress/ui/label"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@booleanpress/ui/autocomplete"

const GROUPS = [
  { value: "Recent", items: ["invoice overdue", "bounce rate"] },
  { value: "Customers", items: ["Northwind Traders", "Fabrikam Studio", "Contoso Clinics"] },
  { value: "Mailers", items: ["Amazon SES", "Postmark", "SendGrid"] },
]

export default function AutocompleteGroups() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="autocomplete-search">Search</Label>
      <Autocomplete items={GROUPS}>
        <AutocompleteInput id="autocomplete-search" placeholder="Search everything" />
        <AutocompleteContent>
          <AutocompleteEmpty />
          <AutocompleteList>
            {(group: (typeof GROUPS)[number]) => (
              <AutocompleteGroup key={group.value} items={group.items}>
                <AutocompleteLabel>{group.value}</AutocompleteLabel>
                {group.items.map((entry) => (
                  <AutocompleteItem key={entry} value={entry}>
                    {entry}
                  </AutocompleteItem>
                ))}
              </AutocompleteGroup>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}
