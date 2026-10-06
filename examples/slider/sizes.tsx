import { Slider } from "@booleanpress/ui/slider"

export default function SliderSizes() {
  return (
    <div className="flex w-64 flex-col gap-8">
      <Slider size="sm" defaultValue={[30]} aria-label="Small" />
      <Slider defaultValue={[50]} aria-label="Default" />
      <Slider size="lg" defaultValue={[70]} aria-label="Large" />
    </div>
  )
}
