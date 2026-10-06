import { CircleCheckIcon, ClockIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge variant="success">
        <CircleCheckIcon /> Verified
      </Badge>
      <Badge variant="warning">
        <ClockIcon /> Pending
      </Badge>
    </div>
  )
}
