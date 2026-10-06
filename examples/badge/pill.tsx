import { Badge } from "@booleanpress/ui/badge"

export default function BadgePill() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge rounded>Newsletter</Badge>
      <Badge rounded variant="secondary">Draft</Badge>
      <Badge rounded variant="success">Delivered</Badge>
      <Badge rounded variant="info">Queued</Badge>
      <Badge rounded variant="warning">Deferred</Badge>
      <Badge rounded variant="destructive">Bounced</Badge>
    </div>
  )
}
