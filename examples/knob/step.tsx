import { Knob } from "@booleanpress/ui/knob"

export default function KnobStep() {
  return <Knob step={10} defaultValue={50} aria-label="Retry delay in seconds" />
}
