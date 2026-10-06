import { Label } from "@booleanpress/ui/label"
import { Textarea } from "@booleanpress/ui/textarea"

export default function TextareaFilled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="footer-text">Footer text</Label>
      <Textarea id="footer-text" variant="filled" placeholder="You receive this email because you have an account with Acme." />
    </div>
  )
}
