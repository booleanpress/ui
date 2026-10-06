import { Label } from "@booleanpress/ui/label"
import { Switch } from "@booleanpress/ui/switch"

export default function SwitchBasic() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="log-emails" defaultChecked />
        <Label htmlFor="log-emails">Keep the email log</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="track-opens" />
        <Label htmlFor="track-opens">Track opens</Label>
      </div>
    </div>
  )
}
