import { InFieldLabel } from "@booleanpress/ui/in-field-label"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function InFieldLabelInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <InFieldLabel>
        <Input id="ifl-api-key" defaultValue="key_test" aria-invalid aria-describedby="ifl-api-key-error" />
        <Label htmlFor="ifl-api-key">API key</Label>
      </InFieldLabel>
      <p id="ifl-api-key-error" className="text-xs text-destructive-strong">
        A live API key starts with key_live_.
      </p>
    </div>
  )
}
