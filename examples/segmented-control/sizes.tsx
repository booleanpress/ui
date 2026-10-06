import { SegmentedControl, SegmentedControlItem } from "@booleanpress/ui/segmented-control"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

export default function SegmentedControlSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      {SIZES.map(({ size, label }) => (
        <SegmentedControl key={size} size={size} defaultValue="week" aria-label={label}>
          <SegmentedControlItem value="day">Day</SegmentedControlItem>
          <SegmentedControlItem value="week">Week</SegmentedControlItem>
          <SegmentedControlItem value="month">Month</SegmentedControlItem>
        </SegmentedControl>
      ))}
    </div>
  )
}
