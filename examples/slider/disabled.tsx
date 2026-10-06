import { Label } from "@booleanpress/ui/label"
import { Slider } from "@booleanpress/ui/slider"

export default function SliderDisabled() {
  return (
    <div className="flex w-64 flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Label id="disabled-rate">Sending rate</Label>
        <Slider defaultValue={[50]} disabled aria-labelledby="disabled-rate" />
      </div>
      <div className="flex flex-col gap-3">
        <Label id="disabled-window">Quiet hours</Label>
        <Slider defaultValue={[20, 80]} disabled aria-labelledby="disabled-window" />
      </div>
    </div>
  )
}
