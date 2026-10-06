import { DateField } from "@booleanpress/ui/date-field"
import { Label } from "@booleanpress/ui/label"
import { BooleanUIProvider } from "@booleanpress/ui/provider"

export default function DateFieldLocaleOrder() {
  return (
    <BooleanUIProvider locale="de-DE" strings={{ day: "Tag", month: "Monat", year: "Jahr", emptySegment: "Leer" }}>
      <div className="flex flex-col gap-2">
        <Label id="rechnung-label">Rechnungsdatum</Label>
        <DateField aria-labelledby="rechnung-label" defaultValue={new Date(2026, 9, 14)} />
      </div>
    </BooleanUIProvider>
  )
}
