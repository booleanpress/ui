import { Label } from "@booleanpress/ui/label"
import { Textarea } from "@booleanpress/ui/textarea"

export default function TextareaInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="note">Internal note</Label>
      <Textarea id="note" aria-invalid aria-describedby="note-error" />
      <p id="note-error" className="text-xs text-destructive-strong">
        Write a note before you save.
      </p>
    </div>
  )
}
