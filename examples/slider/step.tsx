import { Slider } from "@booleanpress/ui/slider"

export default function SliderStep() {
  return <Slider defaultValue={[20]} step={20} aria-label="Retry delay" className="w-64" />
}
