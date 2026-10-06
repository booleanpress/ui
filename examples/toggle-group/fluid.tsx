import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

export default function ToggleGroupFluid() {
  return (
    <div className="w-full">
      <ToggleGroup type="single" fluid defaultValue="open" aria-label="Ticket status">
        <ToggleGroupItem value="open">Open</ToggleGroupItem>
        <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
        <ToggleGroupItem value="closed">Closed</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
