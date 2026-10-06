import { BookmarkIcon, UserIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Panel, PanelContent, PanelFooter, PanelHeader, PanelTitle, PanelTrigger } from "@booleanpress/ui/panel"

export default function PanelWithFooter() {
  return (
    <Panel toggleable className="w-full max-w-xs">
      <PanelHeader>
        <PanelTitle>Ticket #4821</PanelTitle>
        <PanelTrigger />
      </PanelHeader>
      <PanelContent>
        <p>
          Password reset emails reach Outlook addresses an hour late. The delivery log shows the mail server deferring
          them with a 421 reply, then accepting them on the second attempt.
        </p>
        {/* Inside PanelContent the footer folds away with the content. */}
        <PanelFooter className="justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" rounded aria-label="Assign to me">
              <UserIcon />
            </Button>
            <Button variant="ghost" size="icon" rounded className="text-muted-foreground" aria-label="Bookmark">
              <BookmarkIcon />
            </Button>
          </div>
          <span className="text-muted-foreground">Updated 2 hours ago</span>
        </PanelFooter>
      </PanelContent>
    </Panel>
  )
}
