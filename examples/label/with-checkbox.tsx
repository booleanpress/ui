import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"

export default function LabelWithCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="log-bodies" defaultChecked />
      <Label htmlFor="log-bodies">Keep the message body in the log</Label>
    </div>
  )
}
