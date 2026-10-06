import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputNoDuplicates() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="tags-input-unique">Blocked domains</Label>
        <TagsInput id="tags-input-unique" defaultValue={["spam.example", "junk.example"]} placeholder="Add a domain" />
        <p className="text-xs text-muted-foreground">Typing spam.example again adds nothing.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tags-input-repeat">Retry delays (minutes)</Label>
        <TagsInput id="tags-input-repeat" defaultValue={["5", "5", "15"]} allowDuplicates placeholder="Add a delay" />
      </div>
    </div>
  )
}
