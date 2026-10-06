import { InputNumber } from "@booleanpress/ui/input-number"

export default function InputNumberDisabled() {
  return (
    <InputNumber disabled aria-label="Discount" defaultValue={50} format={{ style: "unit", unit: "percent" }} buttons="stacked" />
  )
}
