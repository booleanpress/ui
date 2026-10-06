import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@booleanpress/ui/chart"

const data = [
  { day: "Mon", sent: 412 },
  { day: "Tue", sent: 538 },
  { day: "Wed", sent: 497 },
  { day: "Thu", sent: 603 },
  { day: "Fri", sent: 365 },
  { day: "Sat", sent: 142 },
  { day: "Sun", sent: 118 },
]

const config = { sent: { label: "Emails sent", color: "var(--chart-1)" } } satisfies ChartConfig

export default function ChartBar() {
  return (
    <ChartContainer config={config} className="h-56 w-full max-w-lg">
      <BarChart data={data} margin={{ top: 10, left: 0, right: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip isAnimationActive={false} cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="sent" fill="var(--color-sent)" radius={4} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}
