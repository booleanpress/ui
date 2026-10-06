import { InputMask } from "@booleanpress/ui/input-mask"
import { Label } from "@booleanpress/ui/label"

export default function InputMaskAutoClear() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="billing-phone">Billing phone, cleared when unfinished</Label>
        <InputMask id="billing-phone" type="tel" mask="(999) 999-9999" placeholder="(999) 999-9999" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="backup-phone">Backup phone, kept when unfinished</Label>
        <InputMask
          id="backup-phone"
          type="tel"
          mask="(999) 999-9999"
          placeholder="(999) 999-9999"
          autoClear={false}
          defaultValue="555"
        />
      </div>
    </div>
  )
}
