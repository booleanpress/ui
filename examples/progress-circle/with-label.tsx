import { ProgressCircle } from "@booleanpress/ui/progress-circle"

export default function ProgressCircleWithLabel() {
  return (
    <div className="flex items-center gap-6">
      <ProgressCircle value={75} showValue aria-label="Monthly sending quota" />
      <div className="flex items-center gap-3">
        <ProgressCircle size="lg" value={42} showValue aria-labelledby="quota-label" />
        <div className="text-sm">
          <p id="quota-label" className="font-medium">
            Monthly sending quota
          </p>
          <p className="text-muted-foreground">4,200 of 10,000 emails</p>
        </div>
      </div>
    </div>
  )
}
