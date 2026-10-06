import { Label } from "@booleanpress/ui/label"
import { Textarea } from "@booleanpress/ui/textarea"

export default function TextareaReadOnly() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="textarea-read-only">Bounce reason</Label>
      <Textarea id="textarea-read-only" readOnly defaultValue="550 5.1.1 The email account does not exist." />
    </div>
  )
}
