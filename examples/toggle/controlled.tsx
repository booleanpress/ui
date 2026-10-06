import { useState } from "react"
import { BellIcon } from "lucide-react"
import { Toggle } from "@booleanpress/ui/toggle"

export default function ToggleControlled() {
  const [muted, setMuted] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <Toggle variant="outline" pressed={muted} onPressedChange={setMuted}>
        <BellIcon />
        Mute alerts
      </Toggle>
      <p className="text-sm text-muted-foreground">{muted ? "Alerts are muted." : "Alerts are on."}</p>
    </div>
  )
}
