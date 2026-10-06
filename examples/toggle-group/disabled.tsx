import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

export default function ToggleGroupDisabled() {
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup type="single" variant="outline" disabled defaultValue="list" aria-label="View, group disabled">
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="board">Board</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" defaultValue="list" aria-label="View, one item disabled">
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="board">Board</ToggleGroupItem>
        <ToggleGroupItem value="timeline" disabled>
          Timeline
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
