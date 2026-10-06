import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="backups" disabled />
        <Label htmlFor="backups">Daily backups</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="logging" disabled defaultChecked />
        <Label htmlFor="logging">Keep the email log</Label>
      </div>
    </div>
  )
}
