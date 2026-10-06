import { InputMask } from "@booleanpress/ui/input-mask"
import { Label } from "@booleanpress/ui/label"

export default function InputMaskInvalid() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="invalid-phone">Support phone</Label>
      <InputMask
        id="invalid-phone"
        type="tel"
        mask="(999) 999-9999"
        placeholder="(999) 999-9999"
        aria-invalid
        aria-describedby="invalid-phone-error"
      />
      <p id="invalid-phone-error" className="text-sm text-destructive-strong">
        Enter all ten digits of the number.
      </p>
    </div>
  )
}
