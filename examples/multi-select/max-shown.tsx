import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const LABELS = ["Billing", "Delivery", "Integrations", "Account", "Deliverability", "API", "Refunds"]

export default function MultiSelectMaxShown() {
  return (
    <div className="flex w-full max-w-60 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="multi-select-max">Ticket labels</Label>
        <MultiSelect items={LABELS} defaultValue={["Billing", "Refunds", "Account"]}>
          <MultiSelectTrigger id="multi-select-max" className="w-full">
            <MultiSelectValue maxShown={1} placeholder="Choose labels" />
          </MultiSelectTrigger>
          <MultiSelectContent>
            <MultiSelectList>
              {(label: string) => (
                <MultiSelectItem key={label} value={label}>
                  {label}
                </MultiSelectItem>
              )}
            </MultiSelectList>
          </MultiSelectContent>
        </MultiSelect>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="multi-select-count">Ticket labels, as a count</Label>
        <MultiSelect items={LABELS} defaultValue={["Delivery", "API", "Integrations"]}>
          <MultiSelectTrigger id="multi-select-count" className="w-full">
            <MultiSelectValue display="count" placeholder="Choose labels" />
          </MultiSelectTrigger>
          <MultiSelectContent>
            <MultiSelectList>
              {(label: string) => (
                <MultiSelectItem key={label} value={label}>
                  {label}
                </MultiSelectItem>
              )}
            </MultiSelectList>
          </MultiSelectContent>
        </MultiSelect>
      </div>
    </div>
  )
}
