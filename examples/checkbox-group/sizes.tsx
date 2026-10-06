import { CheckboxGroup, CheckboxGroupItem } from "@booleanpress/ui/checkbox-group"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

export default function CheckboxGroupSizes() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      {SIZES.map(({ size, label }) => (
        <CheckboxGroup key={size} size={size} defaultValue={["delivered"]} aria-label={`${label} checkboxes: log these events`}>
          <CheckboxGroupItem value="delivered" label="Delivered" />
          <CheckboxGroupItem value="opened" label="Opened" />
          <CheckboxGroupItem value="clicked" label="Clicked" />
        </CheckboxGroup>
      ))}
    </div>
  )
}
