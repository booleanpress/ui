import { Knob } from "@booleanpress/ui/knob"

export default function KnobSizes() {
  return (
    <div className="flex items-center gap-6">
      <Knob size="sm" defaultValue={30} aria-label="Small" />
      <Knob defaultValue={50} aria-label="Default" />
      <Knob size="lg" defaultValue={70} aria-label="Large" />
    </div>
  )
}
