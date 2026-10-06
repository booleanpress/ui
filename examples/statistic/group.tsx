import { InboxIcon, MailCheckIcon, MailWarningIcon, MousePointerClickIcon } from "lucide-react"
import { Statistic, StatisticGroup } from "@booleanpress/ui/statistic"

export default function StatisticGroupExample() {
  return (
    <StatisticGroup className="w-full">
      <Statistic label="Sent" value={12408} icon={<InboxIcon />} iconClassName="bg-info-tag text-info-tag-foreground" />
      <Statistic
        label="Delivered"
        value={0.966}
        format="percent"
        trend="up"
        trendValue={0.004}
        icon={<MailCheckIcon />}
        iconClassName="bg-success-tag text-success-tag-foreground"
      />
      <Statistic
        label="Opened"
        value={0.412}
        format="percent"
        trend="down"
        trendValue={0.018}
        icon={<MousePointerClickIcon />}
        iconClassName="bg-secondary text-secondary-foreground"
      />
      <Statistic
        label="Bounced"
        value={86}
        trend="down"
        trendValue={0.3}
        invertTrendColor
        icon={<MailWarningIcon />}
        iconClassName="bg-warning-tag text-warning-tag-foreground"
      />
    </StatisticGroup>
  )
}
