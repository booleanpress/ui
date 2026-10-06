import { Statistic } from "@booleanpress/ui/statistic"

export default function StatisticCurrency() {
  return (
    <div className="flex flex-wrap gap-12">
      <Statistic label="Monthly revenue" value={48250.5} format="currency" currency="EUR" />
      <Statistic label="Average order" value={64} format="currency" currency="USD" formatOptions={{ maximumFractionDigits: 0 }} />
    </div>
  )
}
