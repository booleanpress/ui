import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputDisabled() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="tags-input-disabled">Ticket labels</Label>
      <TagsInput id="tags-input-disabled" disabled defaultValue={["billing", "refund"]} />
    </div>
  )
}
