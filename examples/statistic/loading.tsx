import { Statistic, StatisticGroup } from "@booleanpress/ui/statistic"

export default function StatisticLoading() {
  return (
    <StatisticGroup className="w-full">
      <Statistic label="Sent" loading />
      <Statistic label="Delivered" loading />
      <Statistic label="Opened" loading />
      <Statistic label="Bounced" loading />
    </StatisticGroup>
  )
}
