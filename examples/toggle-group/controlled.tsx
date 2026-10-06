import { useState } from "react"
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

const ALIGNMENTS = [
  { value: "left", label: "Align left", Icon: AlignLeftIcon },
  { value: "center", label: "Align centre", Icon: AlignCenterIcon },
  { value: "right", label: "Align right", Icon: AlignRightIcon },
  { value: "justify", label: "Justify", Icon: AlignJustifyIcon },
]

export default function ToggleGroupControlled() {
  const [alignment, setAlignment] = useState("left")

  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup
        type="single"
        value={alignment}
        allowEmpty={false}
        onValueChange={setAlignment}
        aria-label="Footer text alignment"
      >
        {ALIGNMENTS.map(({ value, label, Icon }) => (
          <ToggleGroupItem key={value} value={value} aria-label={label}>
            <Icon />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="text-xs text-muted-foreground">Footer text: {alignment}</p>
    </div>
  )
}
