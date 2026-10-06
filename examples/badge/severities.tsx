import { Badge } from "@booleanpress/ui/badge"

export default function BadgeSeverities() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge severity="primary">New</Badge>
      <Badge severity="secondary">Draft</Badge>
      <Badge severity="success">Sent</Badge>
      <Badge severity="info">Queued</Badge>
      <Badge severity="warning">Deferred</Badge>
      <Badge severity="danger">Bounced</Badge>
      <Badge severity="contrast">Internal</Badge>
    </div>
  )
}
