import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="api-key">API key</Label>
      <PasswordInput id="api-key" defaultValue="bp_live_51Hx0example" />
    </div>
  )
}
