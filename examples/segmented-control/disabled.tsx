import { SegmentedControl, SegmentedControlItem } from "@booleanpress/ui/segmented-control"

export default function SegmentedControlDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <SegmentedControl disabled defaultValue="off" aria-label="Tracking">
        <SegmentedControlItem value="off">Off</SegmentedControlItem>
        <SegmentedControlItem value="on">On</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl defaultValue="monthly" aria-label="Billing period">
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        <SegmentedControlItem value="yearly" disabled>
          Yearly
        </SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}
