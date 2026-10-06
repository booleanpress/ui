import { Chip, ChipGroup } from "@booleanpress/ui/chip"

export default function ChipDisabled() {
  return (
    <ChipGroup aria-label="Ticket tags">
      <Chip label="Billing" onRemove={() => {}} />
      <Chip label="Refund" disabled onRemove={() => {}} />
    </ChipGroup>
  )
}
