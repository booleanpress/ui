import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

export default function ToggleGroupRequired() {
  return <ToggleGroup type="single" allowEmpty={false} defaultValue="weekly" aria-label="Frequency">
    <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
    <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
    <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
  </ToggleGroup>
}
