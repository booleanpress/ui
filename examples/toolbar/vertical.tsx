import { DownloadIcon, FilterIcon, RefreshCwIcon, SettingsIcon } from "lucide-react"
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "@booleanpress/ui/toolbar"

export default function ToolbarVertical() {
  return (
    <Toolbar orientation="vertical" aria-label="Delivery log">
      <ToolbarGroup>
        <ToolbarButton aria-label="Refresh">
          <RefreshCwIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Filter">
          <FilterIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Export as CSV">
          <DownloadIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Log settings">
        <SettingsIcon />
      </ToolbarButton>
    </Toolbar>
  )
}
