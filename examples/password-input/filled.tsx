import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputFilled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="webhook-secret">Webhook signing secret</Label>
      <PasswordInput id="webhook-secret" variant="filled" defaultValue="whsec_7Kq2example" />
    </div>
  )
}
