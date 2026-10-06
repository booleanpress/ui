import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputStrength() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-2">
      <Label htmlFor="relay-secret">Relay secret</Label>
      <PasswordInput id="relay-secret" placeholder="Enter password" strength defaultValue="relay2026" />
    </div>
  )
}
