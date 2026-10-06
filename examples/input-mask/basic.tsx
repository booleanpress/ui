import { InputMask } from "@booleanpress/ui/input-mask"
import { Label } from "@booleanpress/ui/label"

export default function InputMaskBasic() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="support-phone">Support phone</Label>
      <InputMask id="support-phone" type="tel" mask="(999) 999-9999" placeholder="(999) 999-9999" />
    </div>
  )
}
