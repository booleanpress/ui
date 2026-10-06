import { MeterGroup } from "@booleanpress/ui/meter-group"

export default function MeterGroupBasic() {
  return <MeterGroup aria-label="Storage" values={[{ label: "Space used", value: 15 }]} className="w-full max-w-md" />
}
