import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputToggleMask() {
  const [mask, setMask] = useState(true)
  return (
    <div className="flex w-full max-w-60 flex-col gap-2">
      <Label htmlFor="visible-secret">Account password</Label>
      <PasswordInput id="visible-secret" showToggle mask={mask} onMaskChange={setMask} defaultValue="Example123!" />
    </div>
  )
}
