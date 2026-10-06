import { MeterGroup } from "@booleanpress/ui/meter-group"

// The plan allows 200 GB, so 16 GB of attachments is 8% of the track.
const STORAGE = [
  { label: "Attachments", value: 16, color: "var(--chart-5)" },
  { label: "Logs", value: 8, color: "var(--chart-2)" },
  { label: "Templates", value: 24, color: "var(--chart-4)" },
  { label: "Backups", value: 10, color: "var(--chart-3)" },
]

export default function MeterGroupMinMax() {
  return <MeterGroup aria-label="Storage, of 200 GB" values={STORAGE} max={200} className="w-full max-w-md" />
}
