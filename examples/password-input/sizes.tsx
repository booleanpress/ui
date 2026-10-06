import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <PasswordInput size="sm" aria-label="Small" placeholder="Small" />
      <PasswordInput aria-label="Normal" placeholder="Normal" />
      <PasswordInput size="lg" aria-label="Large" placeholder="Large" />
    </div>
  )
}
