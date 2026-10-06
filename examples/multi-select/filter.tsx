import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const COUNTRIES = ["Australia", "Bangladesh", "Brazil", "Canada", "Egypt", "France", "Germany", "India", "Japan", "Spain"]

export default function MultiSelectFilter() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="multi-select-countries">Block sign-ups from</Label>
      <MultiSelect items={COUNTRIES}>
        <MultiSelectTrigger id="multi-select-countries" className="w-full">
          <MultiSelectValue placeholder="Choose countries" />
        </MultiSelectTrigger>
        <MultiSelectContent filter filterPlaceholder="Filter countries">
          <MultiSelectEmpty />
          <MultiSelectList>
            {(country: string) => (
              <MultiSelectItem key={country} value={country}>
                {country}
              </MultiSelectItem>
            )}
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  )
}
