import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Progress } from "@booleanpress/ui/progress"

export default function ProgressControlled() {
  const [value, setValue] = useState(25)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value} aria-label="Setup progress" />
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground tabular-nums">Step {value / 25} of 4</span>
        <Button size="sm" variant="outline" disabled={value === 100} onClick={() => setValue((v) => Math.min(100, v + 25))}>
          Next step
        </Button>
      </div>
    </div>
  )
}
