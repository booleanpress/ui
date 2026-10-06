import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { OverlayBadge } from "@booleanpress/ui/overlay-badge"

export default function OverlayBadgeAvatar() {
  return (
    <div className="flex items-center justify-center gap-8">
      <OverlayBadge count={4} severity="danger" label="4 unassigned tickets">
        <Avatar size="lg">
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      </OverlayBadge>
      <OverlayBadge dot severity="success" label="Online">
        <Avatar size="lg">
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
      </OverlayBadge>
    </div>
  )
}
