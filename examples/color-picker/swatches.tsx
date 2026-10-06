import { ColorPicker } from "@booleanpress/ui/color-picker"

const BRAND = [
  { value: "#020617", label: "Ink" },
  { value: "#2563eb", label: "Mailer blue" },
  { value: "#0f766e", label: "Teal" },
  { value: "#16a34a", label: "Delivered green" },
  { value: "#ca8a04", label: "Queued amber" },
  { value: "#dc2626", label: "Bounce red" },
  { value: "#9333ea", label: "Violet" },
]

export default function ColorPickerSwatches() {
  return <ColorPicker defaultValue="#2563eb" swatches={BRAND} aria-label="Brand colour" />
}
