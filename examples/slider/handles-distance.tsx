import { Slider } from "@booleanpress/ui/slider"

export default function SliderHandlesDistance() {
  return <Slider defaultValue={[20, 60]} step={5} minStepsBetweenThumbs={4} aria-label="Allowed range" className="w-56" />
}
