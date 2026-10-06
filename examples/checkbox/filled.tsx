import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"

export default function CheckboxFilled() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="copy-admin" variant="filled" />
        <Label htmlFor="copy-admin">Send a copy to the site admin</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="log-body" variant="filled" defaultChecked />
        <Label htmlFor="log-body">Keep the message body in the log</Label>
      </div>
    </div>
  )
}
