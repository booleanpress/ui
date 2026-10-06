import { SegmentedControl, SegmentedControlItem } from "@booleanpress/ui/segmented-control"

export default function SegmentedControlInvalid() {
  return (
    <div className="flex flex-col items-center gap-2">
      <SegmentedControl aria-label="Billing period" aria-invalid aria-describedby="period-error">
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
      </SegmentedControl>
      <p id="period-error" className="text-sm/normal text-destructive-strong">
        Choose how often to bill.
      </p>
    </div>
  )
}
