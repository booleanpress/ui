import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

const REGIONS = ["Europe (Ireland)", "Europe (Frankfurt)", "US East (N. Virginia)"]

export default function ListboxDisabled() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label id="listbox-disabled-label">Sending region</Label>
      <Listbox aria-labelledby="listbox-disabled-label" disabled defaultValue="Europe (Frankfurt)">
        {REGIONS.map((region) => (
          <ListboxItem key={region} value={region}>
            {region}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}
