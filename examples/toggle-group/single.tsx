import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

export default function ToggleGroupSingle() {
  return (
    <ToggleGroup type="single" variant="outline" defaultValue="7d" aria-label="Period">
      <ToggleGroupItem value="24h">24 hours</ToggleGroupItem>
      <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
      <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
    </ToggleGroup>
  )
}
