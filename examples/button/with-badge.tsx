import { BellIcon, UsersIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { OverlayBadge } from "@booleanpress/ui/overlay-badge"

export default function ButtonWithBadge() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button>
        Failed emails
        <Badge count={8} severity="secondary" />
      </Button>
      <Button variant="outline">
        <UsersIcon />
        Contacts
        <Badge count={2} severity="contrast" />
      </Button>
      <OverlayBadge dot severity="info" label="New delivery alerts">
        <Button variant="outline" size="icon" aria-label="Delivery alerts">
          <BellIcon />
        </Button>
      </OverlayBadge>
    </div>
  )
}
