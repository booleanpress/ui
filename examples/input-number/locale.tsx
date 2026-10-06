import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"
import { BooleanUIProvider } from "@booleanpress/ui/provider"

const decimals = { minimumFractionDigits: 2 }

export default function InputNumberLocale() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="revenue-us">United States</Label>
        <BooleanUIProvider locale="en-US">
          <InputNumber id="revenue-us" fluid defaultValue={115744} format={decimals} />
        </BooleanUIProvider>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="revenue-de">Germany</Label>
        <BooleanUIProvider locale="de-DE">
          <InputNumber id="revenue-de" fluid defaultValue={635524} format={decimals} />
        </BooleanUIProvider>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="revenue-in">India</Label>
        <BooleanUIProvider locale="en-IN">
          <InputNumber id="revenue-in" fluid defaultValue={732762} format={decimals} />
        </BooleanUIProvider>
      </div>
    </div>
  )
}
