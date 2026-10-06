import { CircleCheckIcon } from "lucide-react"
import { Progress } from "@booleanpress/ui/progress"

export default function ProgressComplete() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Progress value={100} aria-label="Import progress" />
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <CircleCheckIcon className="size-4 text-success" aria-hidden="true" />
        700 people imported
      </p>
    </div>
  )
}
