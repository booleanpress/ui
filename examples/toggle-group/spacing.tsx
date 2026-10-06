import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

export default function ToggleGroupSpacing() {
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup type="single" variant="outline" size="sm" spacing={2} defaultValue="all" aria-label="Filter, spaced">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="open">Open</ToggleGroupItem>
        <ToggleGroupItem value="closed">Closed</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="lg" defaultValue="all" aria-label="Filter, large">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="open">Open</ToggleGroupItem>
        <ToggleGroupItem value="closed">Closed</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
