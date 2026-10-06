import { Knob } from "@booleanpress/ui/knob"

export default function KnobMinMax() {
  return <Knob min={-50} max={50} defaultValue={10} aria-label="Time zone offset in minutes" />
}
