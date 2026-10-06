import { useState } from "react"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

const SITES = ["shop.example.com", "blog.example.com", "docs.example.com", "status.example.com"]

export default function ListboxCheckbox() {
  const [sites, setSites] = useState(["shop.example.com", "docs.example.com"])
  return (
    <div className="flex w-full max-w-60 flex-col gap-2">
      <Label id="listbox-sites-label">Send from these sites</Label>
      <Listbox aria-labelledby="listbox-sites-label" multiple indicator="checkbox" value={sites} onValueChange={setSites}
        header={
          <div className="flex items-center gap-2">
            <Checkbox id="listbox-select-all" checked={sites.length === SITES.length ? true : sites.length ? "indeterminate" : false}
              onCheckedChange={(checked) => setSites(checked === true ? [...SITES] : [])} />
            <Label htmlFor="listbox-select-all">Select all sites</Label>
          </div>
        }>
        {SITES.map((site) => (
          <ListboxItem key={site} value={site}>
            {site}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}
