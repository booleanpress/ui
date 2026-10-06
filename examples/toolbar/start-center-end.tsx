import { PlusIcon, PrinterIcon, UploadIcon } from "lucide-react"
import { Input } from "@booleanpress/ui/input"
import { Toolbar, ToolbarButton, ToolbarGroup } from "@booleanpress/ui/toolbar"

export default function ToolbarStartCenterEnd() {
  return (
    <Toolbar aria-label="Contacts" className="w-full max-w-2xl">
      <ToolbarGroup>
        <ToolbarButton aria-label="New contact">
          <PlusIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Print">
          <PrinterIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Import contacts">
          <UploadIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarGroup>
        <Input aria-label="Search contacts" placeholder="Search" className="w-48" />
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarButton variant="outline" size="sm">
          Cancel
        </ToolbarButton>
        <ToolbarButton variant="default" size="sm">
          Save
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  )
}
