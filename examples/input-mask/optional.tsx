import { InputMask } from "@booleanpress/ui/input-mask"
import { Label } from "@booleanpress/ui/label"

export default function InputMaskOptional() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="office-phone">Office phone, extension optional</Label>
      <InputMask id="office-phone" type="tel" mask="(999) 999-9999? x99999" placeholder="(999) 999-9999? x99999" />
    </div>
  )
}
