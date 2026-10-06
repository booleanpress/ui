import { AtSignIcon, GlobeIcon } from "lucide-react"
import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

export default function TagsInputCustomTag() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="tags-input-allow">Allowed senders</Label>
      <TagsInput
        id="tags-input-allow"
        defaultValue={["billing@example.com", "example.org"]}
        tagIcon={(tag) => (tag.includes("@") ? <AtSignIcon /> : <GlobeIcon />)}
        placeholder="An address or a domain"
      />
    </div>
  )
}
