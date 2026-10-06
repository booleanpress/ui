import { KanbanIcon, LayoutGridIcon, ListIcon } from "lucide-react"
import { SegmentedControl, SegmentedControlItem } from "@booleanpress/ui/segmented-control"

export default function SegmentedControlWithIcons() {
  return (
    <SegmentedControl defaultValue="grid" aria-label="Ticket view">
      <SegmentedControlItem value="list">
        <ListIcon /> List
      </SegmentedControlItem>
      <SegmentedControlItem value="grid">
        <LayoutGridIcon /> Grid
      </SegmentedControlItem>
      <SegmentedControlItem value="board">
        <KanbanIcon /> Board
      </SegmentedControlItem>
    </SegmentedControl>
  )
}
