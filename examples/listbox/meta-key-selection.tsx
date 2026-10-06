import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

export default function ListboxMetaKeySelection() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-2">
      <Label id="modifier-cities">Cities</Label>
      <Listbox aria-labelledby="modifier-cities" multiple metaKeySelection defaultValue={["Rome"]}>
        {["New York", "Rome", "London", "Istanbul", "Paris"].map((city) => <ListboxItem key={city} value={city}>{city}</ListboxItem>)}
      </Listbox>
      <p className="text-xs text-muted-foreground">Hold Ctrl or Command when clicking to add or remove a city. Space and Enter toggle the highlighted city.</p>
    </div>
  )
}
