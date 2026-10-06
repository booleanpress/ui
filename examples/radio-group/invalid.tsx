import { Label } from "@booleanpress/ui/label"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

export default function RadioGroupInvalid() {
  return (
    <div className="flex flex-col gap-3">
      <RadioGroup required aria-label="Reply handling" aria-invalid aria-describedby="reply-error">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="reply-assign" value="assign" aria-invalid />
          <Label htmlFor="reply-assign">Assign to the sender</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="reply-open" value="open" aria-invalid />
          <Label htmlFor="reply-open">Leave unassigned</Label>
        </div>
      </RadioGroup>
      <p id="reply-error" className="text-xs text-destructive-strong">
        Choose how replies are handled.
      </p>
    </div>
  )
}
