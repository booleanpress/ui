import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberVertical() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="retry-attempts">Retries</Label>
      <InputNumber id="retry-attempts" className="w-10" buttons="vertical" defaultValue={3} min={0} max={10} />
    </div>
  )
}
