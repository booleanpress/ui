import { useState } from "react"
import {
  ColorPicker, ColorPickerArea, ColorPickerSlider, ColorPickerInput,
  ColorPickerPreview, ColorPickerEyeDropper, ColorPickerFormatSelect,
  type ColorChannel, type ColorFormat,
} from "@booleanpress/ui/color-picker"

const formats: { format: ColorFormat; channels: ColorChannel[] }[] = [
  { format: "rgba", channels: ["red", "green", "blue", "alpha"] },
  { format: "hsba", channels: ["hue", "saturation", "brightness", "alpha"] },
  { format: "hsla", channels: ["hue", "saturation", "lightness", "alpha"] },
  { format: "oklcha", channels: ["lightness", "chroma", "hue", "alpha"] },
]

export default function ColorPickerAdvanced() {
  const [format, setFormat] = useState<ColorFormat>("hsla")
  const channels = formats.find((item) => item.format === format)?.channels ?? ["hue", "alpha"]
  return (
    <ColorPicker defaultValue="#276def" format={format} onFormatChange={setFormat} aria-label="Brand colour channels">
      <ColorPickerFormatSelect className="w-full" />
      <ColorPickerArea />
      {channels.map((channel) => <ColorPickerSlider key={`${format}-${channel}`} channel={channel} format={format} />)}
      <div className="flex items-center gap-2">
        <ColorPickerPreview />
        <ColorPickerEyeDropper />
        <ColorPickerInput />
      </div>
      {formats.map((item) => (
        <div key={item.format} role="group" aria-label={item.format.toUpperCase()} className="flex gap-2">
          {item.channels.map((channel) => (
            <div key={channel} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
              <ColorPickerInput channel={channel} format={item.format} />
              <span className="text-xs text-muted-foreground">{channel[0].toUpperCase() + channel.slice(1)}</span>
            </div>
          ))}
        </div>
      ))}
      <ColorPickerInput channel="css" />
    </ColorPicker>
  )
}
