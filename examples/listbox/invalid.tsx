import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

const REGIONS = ["Europe (Ireland)", "Europe (Frankfurt)", "US East (N. Virginia)"]

export default function ListboxInvalid() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label id="listbox-invalid-label">Sending region</Label>
      <Listbox aria-labelledby="listbox-invalid-label" aria-invalid aria-describedby="listbox-invalid-error">
        {REGIONS.map((region) => (
          <ListboxItem key={region} value={region}>
            {region}
          </ListboxItem>
        ))}
      </Listbox>
      <p id="listbox-invalid-error" className="text-xs text-destructive-strong">
        Choose the region your mailer sends from.
      </p>
    </div>
  )
}
