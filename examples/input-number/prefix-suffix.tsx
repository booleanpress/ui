import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberPrefixSuffix() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="parcel-weight">Parcel weight</Label>
        <InputNumber id="parcel-weight" fluid defaultValue={20} format={{ style: "unit", unit: "kilogram" }} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="discount">Discount</Label>
        <InputNumber id="discount" fluid defaultValue={50} min={0} max={100} prefix="%" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="key-expiry">API key expiry</Label>
        <InputNumber
          id="key-expiry"
          fluid
          defaultValue={10}
          prefix="Expires in"
          format={{ style: "unit", unit: "day", unitDisplay: "long" }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="send-rate">Sending rate</Label>
        <InputNumber id="send-rate" fluid defaultValue={120} suffix="emails an hour" />
      </div>
    </div>
  )
}
