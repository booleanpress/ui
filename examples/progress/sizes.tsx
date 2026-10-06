import { Progress } from "@booleanpress/ui/progress"

export default function ProgressSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress size="sm" value={40} aria-label="Small, 40 percent" />
      <Progress value={60} showValue aria-label="Default, 60 percent" />
      <Progress size="lg" value={80} showValue aria-label="Large, 80 percent" />
    </div>
  )
}
