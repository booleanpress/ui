import { Checkbox } from "@booleanpress/ui/checkbox"
import { Label } from "@booleanpress/ui/label"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

export default function CheckboxSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex items-center gap-2">
          <Checkbox id={`size-${size}`} size={size} defaultChecked={size === "default"} />
          <Label htmlFor={`size-${size}`}>{label}</Label>
        </div>
      ))}
    </div>
  )
}
