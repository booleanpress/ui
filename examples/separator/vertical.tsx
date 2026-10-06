import { Separator } from "@booleanpress/ui/separator"

export default function SeparatorVertical() {
  return (
    <div className="flex h-5 items-center gap-3.5 text-sm">
      <span>Logs</span>
      <Separator orientation="vertical" />
      <span>Routing</span>
      <Separator orientation="vertical" />
      <span>Notifications</span>
    </div>
  )
}
