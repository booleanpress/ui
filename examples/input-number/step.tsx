import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberStep() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="retry-interval">Retry interval, in seconds</Label>
      <InputNumber
        id="retry-interval"
        fluid
        buttons="stacked"
        defaultValue={30}
        min={0}
        step={15}
        largeStep={60}
        aria-describedby="retry-interval-hint"
      />
      <p id="retry-interval-hint" className="text-xs text-muted-foreground">
        The arrows step by 15; Page Up, Page Down and Shift with an arrow by 60.
      </p>
    </div>
  )
}
