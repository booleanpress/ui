import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputReadOnly() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="tags-input-read-only">Ticket labels</Label>
      <TagsInput id="tags-input-read-only" readOnly defaultValue={["billing", "refund", "priority"]} />
    </div>
  )
}
