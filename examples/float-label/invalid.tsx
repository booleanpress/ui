import { FloatLabel } from "@booleanpress/ui/float-label"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function FloatLabelInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 pt-4.5">
      <div className="flex flex-col gap-1.5">
        <FloatLabel>
          <Input id="fl-invalid-host" aria-invalid aria-describedby="fl-invalid-host-error" />
          <Label htmlFor="fl-invalid-host">SMTP host</Label>
        </FloatLabel>
        <p id="fl-invalid-host-error" className="text-xs text-destructive-strong">
          Enter the host your provider gave you.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <FloatLabel variant="in">
          <Input id="fl-invalid-port" defaultValue="99999" aria-invalid aria-describedby="fl-invalid-port-error" />
          <Label htmlFor="fl-invalid-port">SMTP port</Label>
        </FloatLabel>
        <p id="fl-invalid-port-error" className="text-xs text-destructive-strong">
          Enter a port from 1 to 65535.
        </p>
      </div>
    </div>
  )
}
