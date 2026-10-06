import { Statistic } from "@booleanpress/ui/statistic"

export default function StatisticTrend() {
  return (
    <div className="flex flex-wrap gap-12">
      <Statistic label="Delivered" value={11982} trend="up" trendValue={0.124} helpText="since last week" />
      <Statistic label="Open rate" value={0.381} format="percent" trend="down" trendValue={0.021} helpText="since last week" />
      <Statistic label="Bounces" value={86} trend="down" trendValue={0.3} invertTrendColor helpText="since last week" />
    </div>
  )
}
