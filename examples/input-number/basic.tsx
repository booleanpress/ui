import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberBasic() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="monthly-quota">Monthly email quota</Label>
      <InputNumber id="monthly-quota" defaultValue={42723} />
    </div>
  )
}
