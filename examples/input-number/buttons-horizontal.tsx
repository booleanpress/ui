import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberButtonsHorizontal() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="credit-top-up">Credit top-up</Label>
      <InputNumber
        id="credit-top-up"
        fluid
        buttons="horizontal"
        defaultValue={10.25}
        step={0.25}
        locale="de-DE"
        format={{ style: "currency", currency: "EUR" }}
      />
    </div>
  )
}
