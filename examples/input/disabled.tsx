import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function InputDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="mailer-id">Mailer ID</Label>
        <Input id="mailer-id" defaultValue="mailer_8f3a2c" readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="region">Region</Label>
        <Input id="region" defaultValue="eu-west-1" disabled />
      </div>
    </div>
  )
}
