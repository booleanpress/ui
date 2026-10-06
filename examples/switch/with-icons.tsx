import { CheckIcon, XIcon } from "lucide-react"
import { Label } from "@booleanpress/ui/label"
import { Switch } from "@booleanpress/ui/switch"

export default function SwitchWithIcons() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="icons-tracking" checkedIcon={<CheckIcon />} uncheckedIcon={<XIcon />} />
        <Label htmlFor="icons-tracking">Track opens</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="icons-retry" checkedIcon={<CheckIcon />} uncheckedIcon={<XIcon />} defaultChecked />
        <Label htmlFor="icons-retry">Retry failed sends</Label>
      </div>
    </div>
  )
}
