import { InputMask } from "@booleanpress/ui/input-mask"
import { Label } from "@booleanpress/ui/label"

export default function InputMaskPatterns() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="invoice-date">Invoice date</Label>
        <InputMask id="invoice-date" mask="99/99/9999" placeholder="99/99/9999" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="licence-key">Licence key</Label>
        <InputMask id="licence-key" mask="a*-999-a999" placeholder="a*-999-a999" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tax-number">Tax number</Label>
        <InputMask id="tax-number" mask="999-99-9999" placeholder="999-99-9999" />
      </div>
    </div>
  )
}
