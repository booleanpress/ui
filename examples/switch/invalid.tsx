import { Label } from "@booleanpress/ui/label"
import { Switch } from "@booleanpress/ui/switch"

export default function SwitchInvalid() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch id="consent" required aria-invalid aria-describedby="consent-error" />
        <Label htmlFor="consent">Store recipient addresses in the log</Label>
      </div>
      <p id="consent-error" className="text-xs text-destructive-strong">
        Turn this on to keep the log searchable.
      </p>
    </div>
  )
}
