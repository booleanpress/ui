import { InputMask } from "@booleanpress/ui/input-mask"
import { Label } from "@booleanpress/ui/label"

export default function InputMaskSlotCharacter() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="renewal-date">Renewal date</Label>
      <InputMask id="renewal-date" mask="99/99/9999" slotChar="mm/dd/yyyy" placeholder="mm/dd/yyyy" />
    </div>
  )
}
