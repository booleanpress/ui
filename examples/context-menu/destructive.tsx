import { CopyIcon, KeyRoundIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@booleanpress/ui/context-menu"

export default function ContextMenuDestructive() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex w-full max-w-md items-center gap-3 rounded-md border bg-card px-4 py-3 text-sm/normal outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid" tabIndex={0}>
        <KeyRoundIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">Production key</span>
        <span className="ms-auto font-mono text-xs text-muted-foreground">bp_live_…8f2a</span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem><PencilIcon />Rename</ContextMenuItem>
        <ContextMenuItem><CopyIcon />Copy key ID</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive"><Trash2Icon />Revoke key</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
