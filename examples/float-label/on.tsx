import { FloatLabel } from "@booleanpress/ui/float-label"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function FloatLabelOn() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 pt-1.5">
      <FloatLabel variant="on">
        <Input id="fl-on-organisation" />
        <Label htmlFor="fl-on-organisation">Organisation</Label>
      </FloatLabel>
      <FloatLabel variant="on">
        <Input id="fl-on-domain" defaultValue="mail.example.com" />
        <Label htmlFor="fl-on-domain">Sending domain</Label>
      </FloatLabel>
    </div>
  )
}
