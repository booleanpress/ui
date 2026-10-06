import { ProgressCircle } from "@booleanpress/ui/progress-circle"

export default function ProgressCircleIndeterminate() {
  return (
    <div className="flex items-center gap-3">
      <ProgressCircle size="sm" aria-labelledby="checking-dns" />
      <span id="checking-dns" className="text-sm">
        Checking the DNS records…
      </span>
    </div>
  )
}
