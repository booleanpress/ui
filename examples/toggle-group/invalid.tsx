import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

export default function ToggleGroupInvalid() {
  return (
    <div className="flex flex-col items-start gap-2">
      <ToggleGroup type="single" aria-label="Billing period" aria-invalid aria-describedby="billing-period-error">
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
      </ToggleGroup>
      <p id="billing-period-error" className="text-xs text-destructive-strong">
        Choose how often the plan is billed.
      </p>
    </div>
  )
}
