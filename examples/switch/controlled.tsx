import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { Switch } from "@booleanpress/ui/switch"

export default function SwitchControlled() {
  const [enabled, setEnabled] = useState(true)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="failure-alerts" checked={enabled} onCheckedChange={setEnabled} />
        <Label htmlFor="failure-alerts">Email me when a send fails</Label>
      </div>
      <p className="text-sm text-muted-foreground">Alerts are {enabled ? "on" : "off"}.</p>
    </div>
  )
}
