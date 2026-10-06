import { MailCheckIcon } from "lucide-react"
import { Statistic } from "@booleanpress/ui/statistic"

export default function StatisticWithIcon() {
  return (
    <Statistic
      variant="card"
      label="Delivered today"
      value={11982}
      trend="up"
      trendValue={0.124}
      helpText="since yesterday"
      icon={<MailCheckIcon />}
      iconClassName="bg-success-tag text-success-tag-foreground"
      className="w-full max-w-xs"
    />
  )
}
