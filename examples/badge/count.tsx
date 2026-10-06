import { Badge } from "@booleanpress/ui/badge"

export default function BadgeCount() {
  return (
    <ul className="flex w-full max-w-xs flex-col gap-3 text-sm">
      <li className="flex items-center justify-between gap-4">
        Open tickets
        <Badge count={4} />
      </li>
      <li className="flex items-center justify-between gap-4">
        Failed emails
        <Badge count={12} severity="danger" />
      </li>
      <li className="flex items-center justify-between gap-4">
        Unread replies
        <Badge count={128} max={99} severity="info" />
      </li>
    </ul>
  )
}
