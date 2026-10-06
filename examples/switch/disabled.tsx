import { Label } from "@booleanpress/ui/label"
import { Switch } from "@booleanpress/ui/switch"

export default function SwitchDisabled() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="queue-off" disabled />
        <Label htmlFor="queue-off">Send through the queue</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="queue-on" disabled defaultChecked />
        <Label htmlFor="queue-on">Retry failed sends</Label>
      </div>
    </div>
  )
}
