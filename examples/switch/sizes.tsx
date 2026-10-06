import { Label } from "@booleanpress/ui/label"
import { Switch } from "@booleanpress/ui/switch"

export default function SwitchSizes() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="size-sm" size="sm" defaultChecked />
        <Label htmlFor="size-sm">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="size-default" defaultChecked />
        <Label htmlFor="size-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="size-lg" size="lg" defaultChecked />
        <Label htmlFor="size-lg">Large</Label>
      </div>
    </div>
  )
}
