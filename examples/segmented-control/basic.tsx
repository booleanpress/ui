import { SegmentedControl, SegmentedControlItem } from "@booleanpress/ui/segmented-control"

export default function SegmentedControlBasic() {
  return (
    <SegmentedControl defaultValue="list" aria-label="Ticket view">
      <SegmentedControlItem value="list">List</SegmentedControlItem>
      <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      <SegmentedControlItem value="board">Board</SegmentedControlItem>
    </SegmentedControl>
  )
}
