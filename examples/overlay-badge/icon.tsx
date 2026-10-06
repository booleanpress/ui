import { BellIcon, CalendarIcon, MailIcon } from "lucide-react"
import { OverlayBadge } from "@booleanpress/ui/overlay-badge"

export default function OverlayBadgeIcon() {
  return (
    <div className="flex items-center justify-center gap-8">
      <OverlayBadge count={2} label="2 new notifications">
        <BellIcon className="size-6 text-foreground" aria-hidden />
      </OverlayBadge>
      <OverlayBadge count={4} severity="danger" label="4 bookings to confirm">
        <CalendarIcon className="size-6 text-foreground" aria-hidden />
      </OverlayBadge>
      <OverlayBadge dot label="New messages">
        <MailIcon className="size-6 text-foreground" aria-hidden />
      </OverlayBadge>
    </div>
  )
}
