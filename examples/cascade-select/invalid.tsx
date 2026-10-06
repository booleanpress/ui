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

export default function CascadeSelectInvalid() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="routing-team">Route to</Label>
      <CascadeSelect
        id="routing-team"
        options={TEAMS}
        placeholder="Choose a team"
        aria-invalid
        aria-describedby="routing-team-error"
        className="w-full"
      />
      <p id="routing-team-error" className="text-xs text-destructive-strong">
        Choose the team that receives new tickets.
      </p>
    </div>
  )
}
