import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

const REGIONS = ["Europe (Ireland)", "Europe (Frankfurt)", "US East (N. Virginia)", "US West (Oregon)", "Asia Pacific (Mumbai)"]

export default function ListboxBasic() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label id="listbox-region-label">Sending region</Label>
      <Listbox aria-labelledby="listbox-region-label" defaultValue="Europe (Ireland)">
        {REGIONS.map((region) => (
          <ListboxItem key={region} value={region}>
            {region}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}
