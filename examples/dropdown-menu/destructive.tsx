import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@booleanpress/ui/dropdown-menu"

export default function DropdownMenuDestructive() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Actions for ticket 1042">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem>
          <PencilIcon />
          Edit ticket
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <TrashIcon />
          Delete ticket
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
