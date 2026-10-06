import { ArchiveIcon, CopyIcon, MailIcon, ReplyIcon, Trash2Icon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@booleanpress/ui/dropdown-menu"
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarOverflowButton } from "@booleanpress/ui/toolbar"

export default function ToolbarOverflowMenu() {
  return (
    <Toolbar aria-label="Ticket #4821" className="w-full max-w-md">
      <ToolbarGroup>
        <ToolbarButton>
          <ReplyIcon /> Reply
        </ToolbarButton>
        <ToolbarButton>
          <ArchiveIcon /> Close ticket
        </ToolbarButton>
      </ToolbarGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* Named by the provider's "More actions" string. */}
          <ToolbarOverflowButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <MailIcon /> Mark as unread
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon /> Copy link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon /> Delete ticket
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Toolbar>
  )
}
