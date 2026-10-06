import { FloatLabel } from "@booleanpress/ui/float-label"
import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberFloatLabel() {
  return (
    <div className="flex flex-wrap items-end gap-4 pt-4.5">
      <FloatLabel>
        <InputNumber id="fl-over-limit" />
        <Label htmlFor="fl-over-limit">Daily limit</Label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputNumber id="fl-on-price" format={{ style: "currency", currency: "USD" }} />
        <Label htmlFor="fl-on-price">Price</Label>
      </FloatLabel>
    </div>
  )
}
