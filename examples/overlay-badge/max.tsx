import { InboxIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { OverlayBadge } from "@booleanpress/ui/overlay-badge"

export default function OverlayBadgeMax() {
  return (
    <div className="flex items-center justify-center gap-10">
      <OverlayBadge count={128} max={99} severity="danger" label="128 failed emails">
        <InboxIcon className="size-6 text-foreground" aria-hidden />
      </OverlayBadge>
      <OverlayBadge count={1250} max={999} label="1,250 open tickets">
        <Button variant="outline">Tickets</Button>
      </OverlayBadge>
    </div>
  )
}
