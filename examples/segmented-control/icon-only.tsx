import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react"
import { SegmentedControl, SegmentedControlItem } from "@booleanpress/ui/segmented-control"

export default function SegmentedControlIconOnly() {
  return (
    <SegmentedControl defaultValue="left" aria-label="Text alignment">
      <SegmentedControlItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </SegmentedControlItem>
      <SegmentedControlItem value="center" aria-label="Align centre">
        <AlignCenterIcon />
      </SegmentedControlItem>
      <SegmentedControlItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </SegmentedControlItem>
      <SegmentedControlItem value="justify" aria-label="Justify">
        <AlignJustifyIcon />
      </SegmentedControlItem>
    </SegmentedControl>
  )
}
