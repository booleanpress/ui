import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"

export default function CheckboxBasic() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept the terms</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="news" defaultChecked />
        <Label htmlFor="news">Send me product news</Label>
      </div>
    </div>
  )
}
