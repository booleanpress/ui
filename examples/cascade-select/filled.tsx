import { CascadeSelect, type CascadeSelectOption } from "@booleanpress/ui/cascade-select"
import { Label } from "@booleanpress/ui/label"

const TEAMS: CascadeSelectOption[] = [
  {
    value: "support",
    label: "Support",
    children: [
      { value: "support-tier-1", label: "Tier 1" },
      { value: "support-tier-2", label: "Tier 2" },
    ],
  },
  {
    value: "billing",
    label: "Billing",
    children: [{ value: "billing-refunds", label: "Refunds" }],
  },
]

export default function CascadeSelectFilled() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="assignee-team">Assign to</Label>
      <CascadeSelect id="assignee-team" variant="filled" options={TEAMS} placeholder="Choose a team" className="w-full" />
    </div>
  )
}
