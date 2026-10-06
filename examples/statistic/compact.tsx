import { Statistic } from "@booleanpress/ui/statistic"

export default function StatisticCompact() {
  return (
    <div className="flex flex-wrap gap-12">
      <Statistic label="Subscribers" value={12400} format="compact" />
      <Statistic label="Emails this year" value={3_870_000} format="compact" />
      <Statistic label="Open rate" value={0.428} format="percent" />
    </div>
  )
}
