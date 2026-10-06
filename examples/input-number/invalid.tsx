import { InputNumber } from "@booleanpress/ui/input-number"

export default function InputNumberInvalid() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <InputNumber aria-invalid aria-label="Amount" placeholder="Amount" />
      <InputNumber aria-invalid aria-label="Amount, filled" placeholder="Amount" variant="filled" />
    </div>
  )
}
