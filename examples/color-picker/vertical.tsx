import { ColorPicker, ColorPickerArea, ColorPickerSlider } from "@booleanpress/ui/color-picker"

export default function ColorPickerVertical() {
  return (
    <ColorPicker defaultFormat="hsba" defaultValue="#276def" aria-label="Header colour" className="max-w-md">
      <div className="flex gap-4">
        <ColorPickerArea className="flex-1" />
        <ColorPickerSlider channel="hue" orientation="vertical" />
        <ColorPickerSlider channel="saturation" orientation="vertical" />
        <ColorPickerSlider channel="brightness" orientation="vertical" />
        <ColorPickerSlider channel="alpha" orientation="vertical" />
      </div>
    </ColorPicker>
  )
}
