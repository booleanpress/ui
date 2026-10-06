import { InFieldLabel } from "@booleanpress/ui/in-field-label"
import { InputMask } from "@booleanpress/ui/input-mask"
import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InFieldLabelWithNumberAndMask() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InFieldLabel>
        <InputNumber id="ifl-monthly-quota" fluid defaultValue={25000} suffix="emails" />
        <Label htmlFor="ifl-monthly-quota">Monthly quota</Label>
      </InFieldLabel>
      <InFieldLabel>
        <InputMask id="ifl-vat-number" mask="aa999999999" placeholder="GB123456789" />
        <Label htmlFor="ifl-vat-number">VAT number</Label>
      </InFieldLabel>
    </div>
  )
}
