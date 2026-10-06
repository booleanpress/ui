import { ArchiveIcon, DownloadIcon, ExternalLinkIcon, FolderIcon, InboxIcon, PrinterIcon, RotateCwIcon } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@booleanpress/ui/context-menu"

export default function ContextMenuSubmenus() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-full max-w-md items-center justify-center rounded-md border border-dashed px-4 text-center text-sm/normal text-muted-foreground outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid" tabIndex={0}>
        Right-click here, or focus and press Shift + F10
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem><ExternalLinkIcon />Open</ContextMenuItem>
        <ContextMenuItem><RotateCwIcon />Resend</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger><DownloadIcon />Export as</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-36">
            <ContextMenuItem>CSV</ContextMenuItem>
            <ContextMenuItem>JSON</ContextMenuItem>
            <ContextMenuItem>EML file</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger><FolderIcon />Move to</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-36">
            <ContextMenuItem><InboxIcon />Inbox</ContextMenuItem>
            <ContextMenuItem><ArchiveIcon />Archive</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem><PrinterIcon />Print</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
