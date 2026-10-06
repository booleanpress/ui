import { BellIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { OverlayBadge } from "@booleanpress/ui/overlay-badge"

export default function OverlayBadgeDot() {
  return (
    <div className="flex items-center justify-center gap-8">
      <OverlayBadge dot severity="info" label="New delivery alerts">
        <Button variant="outline" size="icon" aria-label="Delivery alerts">
          <BellIcon />
        </Button>
      </OverlayBadge>
      <OverlayBadge dot severity="danger" label="A sending domain failed verification">
        <Button variant="outline">Domains</Button>
      </OverlayBadge>
    </div>
  )
}
