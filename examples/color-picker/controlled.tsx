import { useState } from "react"
import { ColorPicker } from "@booleanpress/ui/color-picker"

export default function ColorPickerControlled() {
  const [colour, setColour] = useState("#0f766e")
  const [saved, setSaved] = useState("#0f766e")

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <p className="text-center font-mono text-sm/normal text-muted-foreground">
        onValueChange: {colour}
        <br />
        onValueCommit: {saved}
      </p>
      <ColorPicker value={colour} onValueChange={setColour} onValueCommit={setSaved} aria-label="Email header colour" />
    </div>
  )
}
