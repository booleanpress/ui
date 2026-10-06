import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"

export default function CheckboxInvalid() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Checkbox id="consent" aria-invalid aria-describedby="consent-error" />
        <Label htmlFor="consent">I have permission to email these contacts</Label>
      </div>
      <p id="consent-error" className="ms-6.5 text-xs text-destructive-strong">
        Confirm the permission to continue.
      </p>
    </div>
  )
}
