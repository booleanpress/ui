import { Badge } from "@booleanpress/ui/badge"

export default function BadgeStatus() {
  return (
    <ul className="flex w-full max-w-xs flex-col gap-2 text-sm">
      {[
        { to: "ada@example.com", label: "Delivered", variant: "success" },
        { to: "grace@example.com", label: "Queued", variant: "info" },
        { to: "linus@example.com", label: "Deferred", variant: "warning" },
        { to: "alan@example.com", label: "Failed", variant: "destructive" },
      ].map((row) => (
        <li key={row.to} className="flex items-center justify-between gap-4">
          <span>{row.to}</span>
          <Badge variant={row.variant as "success" | "info" | "warning" | "destructive"}>{row.label}</Badge>
        </li>
      ))}
    </ul>
  )
}
