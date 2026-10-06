import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@booleanpress/ui/context-menu"

export default function ContextMenuBasic() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-full max-w-md items-center justify-center rounded-md border border-dashed px-4 text-center text-sm/normal text-muted-foreground outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid" tabIndex={0}>
        Right-click here, or focus and press Shift + F10
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>View details</ContextMenuItem>
        <ContextMenuItem>Resend</ContextMenuItem>
        <ContextMenuItem>Copy message ID</ContextMenuItem>
        <ContextMenuItem>Add a note</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
