import { MeterGroup } from "@booleanpress/ui/meter-group"

const STORAGE = [
  { label: "Attachments", value: 24, color: "var(--chart-5)" },
  { label: "Logs", value: 16, color: "var(--chart-2)" },
  { label: "Templates", value: 24, color: "var(--chart-4)" },
  { label: "Backups", value: 12, color: "var(--chart-3)" },
]

export default function MeterGroupVertical() {
  return <MeterGroup aria-label="Storage by type" orientation="vertical" values={STORAGE} className="h-72" />
}
