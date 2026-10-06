import { useState } from "react"
import { Slider } from "@booleanpress/ui/slider"

export default function SliderFilter() {
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  return <div className="flex w-64 flex-col gap-4">
    <div role="img" aria-label="Colour preview" className="h-32 rounded-md bg-linear-to-br from-primary via-accent to-muted"
      style={{ filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)` }} />
    <label className="flex flex-col gap-2 text-sm">Brightness: {brightness[0]}%<Slider value={brightness} onValueChange={setBrightness} max={200} aria-label="Brightness" /></label>
    <label className="flex flex-col gap-2 text-sm">Contrast: {contrast[0]}%<Slider value={contrast} onValueChange={setContrast} max={200} aria-label="Contrast" /></label>
    <label className="flex flex-col gap-2 text-sm">Saturation: {saturation[0]}%<Slider value={saturation} onValueChange={setSaturation} max={200} aria-label="Saturation" /></label>
  </div>
}
