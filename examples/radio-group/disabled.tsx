import { Label } from "@booleanpress/ui/label"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

export default function RadioGroupDisabled() {
  return (
    <div className="flex flex-col gap-6">
      <RadioGroup defaultValue="smtp" disabled aria-label="Transport, whole group disabled">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="transport-smtp" value="smtp" />
          <Label htmlFor="transport-smtp">SMTP</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="transport-api" value="api" />
          <Label htmlFor="transport-api">HTTP API</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="free" aria-label="Plan, one option disabled">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="plan-free" value="free" />
          <Label htmlFor="plan-free">Free</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="plan-pro" value="pro" disabled />
          <Label htmlFor="plan-pro">Pro (needs a licence)</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
