import { FloatLabel } from "@booleanpress/ui/float-label"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function FloatLabelIn() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FloatLabel variant="in">
        <Input id="fl-in-host" />
        <Label htmlFor="fl-in-host">SMTP host</Label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Input id="fl-in-port" inputMode="numeric" defaultValue="587" />
        <Label htmlFor="fl-in-port">SMTP port</Label>
      </FloatLabel>
    </div>
  )
}
