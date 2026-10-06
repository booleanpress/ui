import { Label } from "@booleanpress/ui/label"
import { Textarea } from "@booleanpress/ui/textarea"

export default function TextareaDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="bounce-reason">Bounce reason</Label>
      <Textarea id="bounce-reason" defaultValue="550 5.1.1 The email account does not exist." disabled />
    </div>
  )
}
