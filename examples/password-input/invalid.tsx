import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="smtp-password">SMTP password</Label>
      <PasswordInput id="smtp-password" aria-invalid aria-describedby="smtp-password-error" />
      <p id="smtp-password-error" className="text-xs text-destructive-strong">
        Enter the password your provider gave you.
      </p>
    </div>
  )
}
