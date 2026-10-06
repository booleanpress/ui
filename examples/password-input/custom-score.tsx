import { Label } from "@booleanpress/ui/label"
import { PasswordInput } from "@booleanpress/ui/password-input"

export default function PasswordInputCustomScore() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-2">
      <Label htmlFor="custom-secret">Passphrase</Label>
      <PasswordInput id="custom-secret" strength defaultValue="an example phrase"
        scoreStrength={(value) => value ? { level: value.length >= 20 ? "very-strong" : "fair", percent: Math.min(100, value.length * 5) } : null} />
      <p className="text-xs text-muted-foreground">An example length policy. Use your application's password policy for production.</p>
    </div>
  )
}
