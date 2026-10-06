import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

const PLANS = [
  { value: "free", label: "Free", disabled: false },
  { value: "starter", label: "Starter", disabled: false },
  { value: "agency", label: "Agency (sold out)", disabled: true },
  { value: "enterprise", label: "Enterprise (contact sales)", disabled: true },
]

export default function ListboxDisabledOptions() {
  return (
    <div className="flex w-full max-w-60 flex-col gap-2">
      <Label id="listbox-plan-label">Plan</Label>
      <Listbox aria-labelledby="listbox-plan-label" defaultValue="starter">
        {PLANS.map((plan) => (
          <ListboxItem key={plan.value} value={plan.value} disabled={plan.disabled}>
            {plan.label}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}
