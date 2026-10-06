import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberMinMax() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="bounce-threshold">Bounce threshold, 0 to 100</Label>
      <InputNumber
        id="bounce-threshold"
        fluid
        buttons="stacked"
        defaultValue={95}
        min={0}
        max={100}
        aria-describedby="bounce-threshold-hint"
      />
      <p id="bounce-threshold-hint" className="text-xs text-muted-foreground">
        Home goes to 0 and End to 100; at either end its button turns off.
      </p>
    </div>
  )
}
