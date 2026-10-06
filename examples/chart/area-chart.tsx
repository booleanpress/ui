import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@booleanpress/ui/chart"

const data = [
  { day: "Mon", delivered: 402, bounced: 10 },
  { day: "Tue", delivered: 521, bounced: 17 },
  { day: "Wed", delivered: 488, bounced: 9 },
  { day: "Thu", delivered: 570, bounced: 33 },
  { day: "Fri", delivered: 358, bounced: 7 },
  { day: "Sat", delivered: 140, bounced: 2 },
  { day: "Sun", delivered: 117, bounced: 1 },
]

const config = {
  delivered: { label: "Delivered", color: "var(--chart-2)" },
  bounced: { label: "Bounced", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function ChartArea() {
  return (
    <ChartContainer config={config} className="h-64 w-full max-w-lg">
      <AreaChart data={data} margin={{ top: 10, left: 0, right: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip isAnimationActive={false} content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area dataKey="delivered" type="monotone" stroke="var(--color-delivered)" fill="var(--color-delivered)" fillOpacity={0.2} isAnimationActive={false} />
        <Area dataKey="bounced" type="monotone" stroke="var(--color-bounced)" fill="var(--color-bounced)" fillOpacity={0.2} isAnimationActive={false} />
      </AreaChart>
    </ChartContainer>
  )
}
