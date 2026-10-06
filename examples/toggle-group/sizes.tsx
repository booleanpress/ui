import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

const SIZES = [
  { size: "sm", label: "small" },
  { size: "default", label: "default" },
  { size: "lg", label: "large" },
] as const

export default function ToggleGroupSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      {SIZES.map(({ size, label }) => (
        <ToggleGroup key={size} type="multiple" size={size} aria-label={`Show events, ${label} size`}>
          <ToggleGroupItem value="opens">Opens</ToggleGroupItem>
          <ToggleGroupItem value="clicks">Clicks</ToggleGroupItem>
          <ToggleGroupItem value="bounces">Bounces</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  )
}
