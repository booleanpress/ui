import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="locked-key">Licence key</Label>
      <PasswordInput id="locked-key" defaultValue="BSMTP-0000-0000" disabled />
    </div>
  )
}
