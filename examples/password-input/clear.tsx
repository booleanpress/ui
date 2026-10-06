import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputClear() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="relay-password">Relay password</Label>
      <PasswordInput id="relay-password" clearable defaultValue="relay-pass-2026" />
    </div>
  )
}
