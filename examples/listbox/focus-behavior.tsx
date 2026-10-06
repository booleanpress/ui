import { useState } from "react"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

export default function ListboxFocusBehavior() {
  const [autoFocus, setAutoFocus] = useState(true)
  const [select, setSelect] = useState(false)
  const [hover, setHover] = useState(true)
  return (
    <div className="flex w-full max-w-72 flex-col gap-3">
      <div className="flex items-center gap-2"><Checkbox id="list-auto-focus" checked={autoFocus} onCheckedChange={(v) => setAutoFocus(v === true)} /><Label htmlFor="list-auto-focus">Auto option focus</Label></div>
      <div className="flex items-center gap-2"><Checkbox id="list-select-focus" checked={select} onCheckedChange={(v) => setSelect(v === true)} /><Label htmlFor="list-select-focus">Select on focus</Label></div>
      <div className="flex items-center gap-2"><Checkbox id="list-hover-focus" checked={hover} onCheckedChange={(v) => setHover(v === true)} /><Label htmlFor="list-hover-focus">Focus on hover</Label></div>
      <Listbox aria-label="City" autoOptionFocus={autoFocus} selectOnFocus={select} focusOnHover={hover}>
        {["New York", "Rome", "London", "Istanbul", "Paris"].map((city) => <ListboxItem key={city} value={city}>{city}</ListboxItem>)}
      </Listbox>
    </div>
  )
}
