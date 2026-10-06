import { Label } from "@booleanpress/ui/label"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

export default function RadioGroupSizes() {
  return (
    <RadioGroup defaultValue="default" aria-label="Size" orientation="horizontal" className="flex flex-wrap gap-4">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex items-center gap-2">
          <RadioGroupItem id={`radio-size-${size}`} value={size} size={size} />
          <Label htmlFor={`radio-size-${size}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
