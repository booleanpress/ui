import { ColorPickerPopover } from "@booleanpress/ui/color-picker"

export default function ColorPickerInPopover() {
  return (
    <div className="flex items-center gap-3">
      <ColorPickerPopover defaultValue="#ff0000" aria-label="Accent colour" />
      <span className="text-sm/normal text-foreground">Accent colour</span>
    </div>
  )
}
