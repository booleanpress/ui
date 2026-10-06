import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputMax() {
  const [keywords, setKeywords] = useState(["invoice", "receipt"])

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="tags-input-max">Priority keywords</Label>
      <TagsInput id="tags-input-max" value={keywords} onValueChange={setKeywords} max={5} placeholder="Add a keyword" />
      <p className="text-xs text-muted-foreground">{keywords.length} of 5 keywords.</p>
    </div>
  )
}
