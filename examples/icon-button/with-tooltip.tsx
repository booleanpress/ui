import { CopyIcon, DownloadIcon, ShareIcon } from "lucide-react"
import { IconButton } from "@booleanpress/ui/icon-button"

export default function IconButtonWithTooltip() {
  return (
    <div className="flex gap-2">
      <IconButton label="Copy message ID" tooltip>
        <CopyIcon />
      </IconButton>
      <IconButton label="Download the report" tooltip tooltipSide="bottom">
        <DownloadIcon />
      </IconButton>
      <IconButton label="Share with the organisation" tooltip tooltipSide="right">
        <ShareIcon />
      </IconButton>
    </div>
  )
}
