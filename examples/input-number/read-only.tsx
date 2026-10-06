import { InputNumber } from "@booleanpress/ui/input-number"

export default function InputNumberReadOnly() {
  return (
    <InputNumber readOnly aria-label="Emails sent this month" defaultValue={8420} buttons="stacked" />
  )
}
