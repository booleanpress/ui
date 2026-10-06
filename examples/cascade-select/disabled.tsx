import { CascadeSelect, type CascadeSelectOption } from "@booleanpress/ui/cascade-select"
import { Label } from "@booleanpress/ui/label"

const TEAMS: CascadeSelectOption[] = [
  {
    value: "support",
    label: "Support",
    children: [
      { value: "support-tier-1", label: "Tier 1" },
      { value: "support-tier-2", label: "Tier 2", disabled: true },
    ],
  },
  {
    value: "billing",
    label: "Billing",
    disabled: true,
    children: [{ value: "billing-refunds", label: "Refunds" }],
  },
]

export default function CascadeSelectDisabled() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="locked-team">Owner team</Label>
        <CascadeSelect id="locked-team" options={TEAMS} defaultValue="support-tier-1" disabled className="w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="partly-disabled-team">Backup team</Label>
        <CascadeSelect id="partly-disabled-team" options={TEAMS} placeholder="Choose a team" className="w-full" />
      </div>
    </div>
  )
}
