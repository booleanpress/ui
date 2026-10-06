import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

const RULES = [
  { label: "At least 12 characters", test: (value: string) => value.length >= 12 },
  { label: "An upper-case letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "A lower-case letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "A number", test: (value: string) => /[0-9]/.test(value) },
  { label: "A symbol, such as ! @ # $", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

export default function PasswordInputRulesPopover() {
  return (
    <div className="flex w-full max-w-60 flex-col gap-2">
      <Label htmlFor="admin-password">Admin password</Label>
      <PasswordInput id="admin-password" placeholder="Create a password" rules={RULES} strength="rules" showToggle feedback="popover" />
    </div>
  )
}
