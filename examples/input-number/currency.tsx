import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"
import { BooleanUIProvider } from "@booleanpress/ui/provider"

export default function InputNumberCurrency() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="plan-usd">Plan price, US dollars</Label>
        <BooleanUIProvider locale="en-US">
          <InputNumber id="plan-usd" fluid defaultValue={1500} format={{ style: "currency", currency: "USD" }} />
        </BooleanUIProvider>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="plan-eur">Plan price, euros</Label>
        <BooleanUIProvider locale="de-DE">
          <InputNumber id="plan-eur" fluid defaultValue={2500} format={{ style: "currency", currency: "EUR" }} />
        </BooleanUIProvider>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="plan-inr">Plan price, rupees</Label>
        <BooleanUIProvider locale="en-IN">
          <InputNumber
            id="plan-inr"
            fluid
            defaultValue={4250}
            format={{ style: "currency", currency: "INR", currencyDisplay: "code" }}
          />
        </BooleanUIProvider>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="plan-jpy">Plan price, yen</Label>
        <BooleanUIProvider locale="ja-JP">
          <InputNumber id="plan-jpy" fluid defaultValue={5002} format={{ style: "currency", currency: "JPY" }} />
        </BooleanUIProvider>
      </div>
    </div>
  )
}
