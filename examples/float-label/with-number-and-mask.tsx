import { FloatLabel } from "@booleanpress/ui/float-label"
import { InputMask } from "@booleanpress/ui/input-mask"
import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function FloatLabelWithNumberAndMask() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 pt-4.5">
      <FloatLabel>
        <InputNumber id="fl-daily-limit" fluid min={0} />
        <Label htmlFor="fl-daily-limit">Daily sending limit</Label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputMask id="fl-support-phone" type="tel" mask="(999) 999-9999" />
        <Label htmlFor="fl-support-phone">Support phone</Label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputNumber id="fl-batch-size" fluid buttons="stacked" defaultValue={500} step={50} min={50} />
        <Label htmlFor="fl-batch-size">Batch size</Label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputNumber id="fl-retries" fluid buttons="horizontal" defaultValue={3} min={0} max={10} />
        <Label htmlFor="fl-retries">Retries</Label>
      </FloatLabel>
    </div>
  )
}
