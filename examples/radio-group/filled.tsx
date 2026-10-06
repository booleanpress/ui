import { Label } from "@booleanpress/ui/label"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

export default function RadioGroupFilled() {
  return (
    <RadioGroup variant="filled" defaultValue="html" aria-label="Email format">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="format-html" value="html" />
        <Label htmlFor="format-html">HTML</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="format-text" value="text" />
        <Label htmlFor="format-text">Plain text</Label>
      </div>
    </RadioGroup>
  )
}
