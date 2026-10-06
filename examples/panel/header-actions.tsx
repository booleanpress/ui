import { EllipsisVerticalIcon, PencilIcon, PowerIcon, Trash2Icon } from "lucide-react"
import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { Button } from "@booleanpress/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@booleanpress/ui/dropdown-menu"
import { Panel, PanelActions, PanelContent, PanelHeader, PanelTitle, PanelTrigger } from "@booleanpress/ui/panel"

export default function PanelHeaderActions() {
  return (
    <Panel toggleable className="w-full max-w-xs">
      <PanelHeader>
        <PanelTitle className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          Mailgun
        </PanelTitle>
        <PanelActions>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" rounded className="text-muted-foreground" aria-label="Mailgun actions">
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <PencilIcon /> Edit connection
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PowerIcon /> Turn off
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2Icon /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PanelTrigger />
        </PanelActions>
      </PanelHeader>
      <PanelContent>
        <p>
          The fallback mailer: when Amazon SES refuses an email, it is sent through Mailgun&apos;s EU region instead. 214
          emails took this path in October.
        </p>
      </PanelContent>
    </Panel>
  )
}
