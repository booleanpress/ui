import { useState } from "react"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"
import { Slider } from "@booleanpress/ui/slider"

export default function SliderWithInput() {
  const [value, setValue] = useState(50)

  return (
    <div className="flex w-64 flex-col gap-3">
      <Label htmlFor="batch-size">Batch size</Label>
      <Input
        id="batch-size"
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Math.min(100, Math.max(0, Number(event.target.value))))}
      />
      <Slider value={[value]} onValueChange={([next]) => setValue(next)} aria-label="Batch size" />
    </div>
  )
}
