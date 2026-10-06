import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Chip, ChipGroup } from "@booleanpress/ui/chip"

const TAGS = ["Billing", "Refund", "Priority", "VIP"]

export default function ChipRemovable() {
  const [tags, setTags] = useState(TAGS)

  return (
    <div className="flex flex-col items-center gap-3">
      {/* In a group, focus lands on the group when the last chip goes, not on the page. */}
      <ChipGroup aria-label="Ticket tags" className="justify-center">
        {tags.map((tag) => (
          <Chip key={tag} label={tag} onRemove={() => setTags((current) => current.filter((t) => t !== tag))} />
        ))}
      </ChipGroup>
      {tags.length < TAGS.length ? (
        <Button variant="link" size="sm" onClick={() => setTags(TAGS)}>
          Restore tags
        </Button>
      ) : null}
    </div>
  )
}
