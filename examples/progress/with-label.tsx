import { Label } from "@booleanpress/ui/label"
import { Progress } from "@booleanpress/ui/progress"

export default function ProgressWithLabel() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <Label id="import-label">Importing people</Label>
        <span className="text-muted-foreground tabular-nums">420 of 700</span>
      </div>
      <Progress value={60} aria-labelledby="import-label" />
    </div>
  )
}
