import { BellIcon, BellOffIcon } from "lucide-react"
import { Toggle } from "@booleanpress/ui/toggle"

export default function ToggleStateContent() {
  return <Toggle aria-label="Notifications">{({ pressed }) => <>
    {pressed ? <BellIcon /> : <BellOffIcon />}
    {pressed ? "Enabled" : "Disabled"}
  </>}</Toggle>
}
