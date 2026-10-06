import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputDelimiter() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="tags-input-cc">Copy delivery reports to</Label>
      <TagsInput id="tags-input-cc" delimiter="," placeholder="ops@example.com, finance@example.com" />
      <p className="text-xs text-muted-foreground">Separate addresses with a comma or Enter; pasted lists are split too.</p>
    </div>
  )
}
