import { Badge } from "@booleanpress/ui/badge"

export default function BadgeAsLink() {
  return (
    <Badge asChild variant="secondary">
      <a href="#open-tickets">12 open tickets</a>
    </Badge>
  )
}
