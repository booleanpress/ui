import { useState } from "react"
import { InputMask } from "@booleanpress/ui/input-mask"
import { Label } from "@booleanpress/ui/label"

export default function InputMaskUnmask() {
  const [raw, setRaw] = useState("")
  const [masked, setMasked] = useState("")

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="sms-number">SMS alerts number</Label>
      <InputMask
        id="sms-number"
        type="tel"
        mask="(999) 999-9999"
        placeholder="(999) 999-9999"
        unmask
        onValueChange={setRaw}
        onChange={(event) => setMasked(event.target.value)}
      />
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 text-sm text-muted-foreground">
        <dt>Value</dt>
        <dd className="font-mono text-foreground">{raw || "—"}</dd>
        <dt>Shown</dt>
        <dd className="font-mono text-foreground">{masked || "—"}</dd>
      </dl>
    </div>
  )
}
