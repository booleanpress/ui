import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@booleanpress/ui/context-menu"

export default function ContextMenuShortcuts() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-full max-w-md items-center justify-center rounded-md border border-dashed px-4 text-center text-sm/normal text-muted-foreground outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid" tabIndex={0}>
        Right-click here, or focus and press Shift + F10
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem>Reply<ContextMenuShortcut>R</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Forward<ContextMenuShortcut>F</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Copy link<ContextMenuShortcut>⌘L</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Mark as read<ContextMenuShortcut>⇧U</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete<ContextMenuShortcut>⌫</ContextMenuShortcut></ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
