import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputInvalid() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="tags-input-invalid">Alert recipients</Label>
      <TagsInput id="tags-input-invalid" placeholder="Add an address" aria-invalid aria-describedby="tags-input-invalid-error" />
      <p id="tags-input-invalid-error" className="text-xs text-destructive-strong">
        Add at least one address to send alerts to.
      </p>
    </div>
  )
}
