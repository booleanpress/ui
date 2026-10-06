import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxEmpty, ListboxItem } from "@booleanpress/ui/listbox"

const ZONES = ["UTC", "Europe/London", "Europe/Berlin", "Europe/Madrid", "America/New_York", "America/Chicago", "Asia/Dhaka", "Asia/Tokyo"]

export default function ListboxFilter() {
  const [query, setQuery] = useState("")
  return (
    <div className="flex w-full max-w-60 flex-col gap-2">
      <Label id="listbox-zone-label">Report time zone</Label>
      <Listbox aria-labelledby="listbox-zone-label" filter filterValue={query} onFilterValueChange={setQuery} filterMatch="startsWith" filterPlaceholder="Search time zones" defaultValue="UTC" listClassName="max-h-48">
        {ZONES.map((zone) => (
          <ListboxItem key={zone} value={zone}>
            {zone}
          </ListboxItem>
        ))}
        <ListboxEmpty />
      </Listbox>
    </div>
  )
}
