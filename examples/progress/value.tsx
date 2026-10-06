import { Progress } from "@booleanpress/ui/progress"

export default function ProgressValue() {
  return <Progress value={50} showValue aria-label="Import progress" className="w-full max-w-sm" />
}
