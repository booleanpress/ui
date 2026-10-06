import { Label } from "@booleanpress/ui/label"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

export default function RadioGroupBasic() {
  return (
    <RadioGroup defaultValue="queue" aria-label="Sending mode">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="mode-instant" value="instant" />
        <Label htmlFor="mode-instant">Send at once</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="mode-queue" value="queue" />
        <Label htmlFor="mode-queue">Send through the queue</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="mode-off" value="off" />
        <Label htmlFor="mode-off">Do not send</Label>
      </div>
    </RadioGroup>
  )
}
