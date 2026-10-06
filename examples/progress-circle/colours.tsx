import { ProgressCircle } from "@booleanpress/ui/progress-circle"

export default function ProgressCircleColours() {
  return (
    <div className="flex items-center gap-6">
      <ProgressCircle size="lg" variant="success" value={98} showValue aria-label="Delivered" />
      <ProgressCircle size="lg" variant="info" value={64} showValue aria-label="Opened" />
      <ProgressCircle size="lg" variant="warning" value={12} showValue aria-label="Deferred" />
      <ProgressCircle size="lg" variant="destructive" value={2} showValue aria-label="Bounced" />
    </div>
  )
}
