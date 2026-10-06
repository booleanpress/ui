import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@booleanpress/ui/combobox"

const CATEGORIES = ["Billing", "Delivery", "Integrations", "Account", "Deliverability", "API"]

export default function ComboboxClear() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="combobox-category">Ticket category</Label>
      <Combobox items={CATEGORIES} defaultValue="Delivery">
        <ComboboxInput id="combobox-category" placeholder="Any category" showClear />
        <ComboboxContent>
          <ComboboxEmpty />
          <ComboboxList>
            {(category: string) => (
              <ComboboxItem key={category} value={category}>
                {category}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
