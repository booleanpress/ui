import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup type="multiple" variant="outline" defaultValue={["bounced", "failed"]} aria-label="Show statuses">
      <ToggleGroupItem value="delivered">Delivered</ToggleGroupItem>
      <ToggleGroupItem value="bounced">Bounced</ToggleGroupItem>
      <ToggleGroupItem value="failed">Failed</ToggleGroupItem>
    </ToggleGroup>
  )
}
