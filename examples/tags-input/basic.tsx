import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputBasic() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="tags-input-labels">Ticket labels</Label>
      <TagsInput id="tags-input-labels" defaultValue={["billing"]} placeholder="Type a label, then Enter" />
    </div>
  )
}
