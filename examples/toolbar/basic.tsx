import { BoldIcon, ItalicIcon, LinkIcon, ListIcon, ListOrderedIcon, Redo2Icon, Undo2Icon } from "lucide-react"
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "@booleanpress/ui/toolbar"

export default function ToolbarBasic() {
  return (
    <Toolbar aria-label="Email template formatting" className="w-full max-w-xl justify-start">
      <ToolbarGroup>
        <ToolbarButton aria-label="Undo">
          <Undo2Icon />
        </ToolbarButton>
        <ToolbarButton aria-label="Redo" disabled>
          <Redo2Icon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold">
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Insert link">
          <LinkIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Bulleted list">
          <ListIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Numbered list">
          <ListOrderedIcon />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  )
}
