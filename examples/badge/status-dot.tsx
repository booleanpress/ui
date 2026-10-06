import { Badge } from "@booleanpress/ui/badge"

const QUEUES = [
  { name: "Order receipts", status: "Delivering", severity: "success" },
  { name: "Weekly digest", status: "Paused", severity: "warning" },
  { name: "Password resets", status: "Failed", severity: "danger" },
] as const

export default function BadgeStatusDot() {
  return (
    <ul className="flex w-full max-w-xs flex-col gap-3 text-sm">
      {QUEUES.map((queue) => (
        <li key={queue.name} className="flex items-center justify-between gap-4">
          {queue.name}
          <span className="flex items-center gap-2 text-muted-foreground">
            <Badge dot severity={queue.severity} aria-hidden />
            {queue.status}
          </span>
        </li>
      ))}
    </ul>
  )
}
