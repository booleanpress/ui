import { Label } from "@booleanpress/ui/label"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

export default function RadioGroupHorizontal() {
  return (
    <RadioGroup defaultValue="30" orientation="horizontal" aria-label="Keep logs for" className="flex gap-6">
      {["7", "30", "90"].map((days) => (
        <div key={days} className="flex items-center gap-2">
          <RadioGroupItem id={`keep-${days}`} value={days} />
          <Label htmlFor={`keep-${days}`}>{days} days</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
