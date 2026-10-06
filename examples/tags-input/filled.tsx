import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputFilled() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="tags-input-filled">Ticket labels</Label>
      <TagsInput id="tags-input-filled" variant="filled" defaultValue={["refund"]} placeholder="Add a label" />
    </div>
  )
}
