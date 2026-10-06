import { InboxIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"

export default function BadgeInButton() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button>
        Failed emails
        <Badge count={8} severity="secondary" />
      </Button>
      <Button variant="outline">
        <InboxIcon />
        Open tickets
        <Badge count={142} max={99} severity="contrast" />
      </Button>
    </div>
  )
}
