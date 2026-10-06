import { Checkbox } from "@booleanpress/ui/checkbox"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function LabelDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="auto-retry" className="peer" disabled />
        <Label htmlFor="auto-retry">Retry failed sends</Label>
      </div>
      <div className="group flex flex-col gap-2" data-disabled="true">
        <Label htmlFor="retry-limit">Retry limit</Label>
        <Input id="retry-limit" defaultValue="3" disabled />
      </div>
    </div>
  )
}
