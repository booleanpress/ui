import { InputNumber } from "@booleanpress/ui/input-number"

export default function InputNumberSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <InputNumber size="sm" aria-label="Small" placeholder="Small" buttons="stacked" />
      <InputNumber aria-label="Normal" placeholder="Normal" buttons="stacked" />
      <InputNumber size="lg" aria-label="Large" placeholder="Large" buttons="stacked" />
    </div>
  )
}
