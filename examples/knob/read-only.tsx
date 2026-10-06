import { Knob } from "@booleanpress/ui/knob"

export default function KnobReadOnly() {
  return <Knob readOnly value={50} aria-label="Disk usage" />
}
