import { CascadeSelect, type CascadeSelectOption } from "@booleanpress/ui/cascade-select"

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

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

export default function CascadeSelectSizes() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-4">
      {SIZES.map(({ size, label }) => (
        <CascadeSelect key={size} size={size} options={TEAMS} placeholder={label} aria-label={`Team, ${label.toLowerCase()} size`} className="w-full" />
      ))}
    </div>
  )
}
