import { Progress } from "@booleanpress/ui/progress"

export default function ProgressIndeterminate() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <p id="connect-label" className="text-sm">
        Connecting to the mailer…
      </p>
      <Progress aria-labelledby="connect-label" />
    </div>
  )
}
