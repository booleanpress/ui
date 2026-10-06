import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@booleanpress/ui/toolbar"

export default function ToolbarToggleGroups() {
  return (
    <Toolbar aria-label="Signature formatting" className="w-full max-w-xl justify-start">
      <ToolbarToggleGroup type="multiple" aria-label="Text style" defaultValue={["bold"]}>
        <ToolbarToggleItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarToggleGroup type="single" aria-label="Alignment" defaultValue="left">
        <ToolbarToggleItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="center" aria-label="Align centre">
          <AlignCenterIcon />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarButton variant="outline" size="sm" className="ms-auto">
        Preview
      </ToolbarButton>
    </Toolbar>
  )
}
