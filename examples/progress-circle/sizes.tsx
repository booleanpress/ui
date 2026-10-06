import { ProgressCircle } from "@booleanpress/ui/progress-circle"

export default function ProgressCircleSizes() {
  return (
    <div className="flex items-center gap-6">
      <ProgressCircle size="sm" value={40} aria-label="Small, 40 percent" />
      <ProgressCircle value={60} aria-label="Default, 60 percent" />
      <ProgressCircle size="lg" value={80} aria-label="Large, 80 percent" />
    </div>
  )
}
