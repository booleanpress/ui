import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function InputInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="smtp-host">SMTP host</Label>
      <Input id="smtp-host" defaultValue="smtp example com" aria-invalid aria-describedby="smtp-host-error" />
      <p id="smtp-host-error" className="text-xs text-destructive-strong">
        Enter a host name such as smtp.example.com.
      </p>
    </div>
  )
}
