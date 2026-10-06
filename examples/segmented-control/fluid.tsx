import { SegmentedControl, SegmentedControlItem } from "@booleanpress/ui/segmented-control"

export default function SegmentedControlFluid() {
  return (
    <SegmentedControl fluid defaultValue="sent" aria-label="Message folder" className="max-w-xl">
      <SegmentedControlItem value="sent">Sent</SegmentedControlItem>
      <SegmentedControlItem value="scheduled">Scheduled</SegmentedControlItem>
      <SegmentedControlItem value="failed">Failed</SegmentedControlItem>
    </SegmentedControl>
  )
}
