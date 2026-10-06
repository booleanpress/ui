import { XIcon } from "lucide-react"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"

export default function CheckboxCustomIndicator() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="block-sender" icon={<XIcon />} defaultChecked />
        <Label htmlFor="block-sender">Block emails from this sender</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="block-domain" icon={<XIcon />} />
        <Label htmlFor="block-domain">Block emails from the whole domain</Label>
      </div>
    </div>
  )
}
