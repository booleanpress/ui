import { Label } from "@booleanpress/ui/label"
import { TagsInput } from "@booleanpress/ui/tags-input"

const SUGGESTIONS = ["billing", "bounce", "deliverability", "dkim", "dns", "feature request", "onboarding", "refund", "spf"]

export default function TagsInputTypeahead() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="tags-input-typeahead">Ticket labels</Label>
      <TagsInput id="tags-input-typeahead" suggestions={SUGGESTIONS} defaultValue={["dns"]} placeholder="Type to see suggestions" />
    </div>
  )
}
