import { Progress } from "@booleanpress/ui/progress"

export default function ProgressBasic() {
  return <Progress value={60} aria-label="Import progress" className="w-full max-w-sm" />
}
