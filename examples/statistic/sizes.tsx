import { Statistic } from "@booleanpress/ui/statistic"

export default function StatisticSizes() {
  return (
    <div className="flex flex-wrap items-start gap-12">
      <Statistic size="sm" label="Small" value={12408} />
      <Statistic label="Default" value={12408} />
      <Statistic size="lg" label="Large" value={12408} />
    </div>
  )
}
