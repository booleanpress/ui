"use client"

// Recharts' parts are client code, so the chart is composed in a client module, as an app would.
import { Bar, BarChart, XAxis } from "recharts"
import { ChartContainer, type ChartConfig } from "@booleanpress/ui/chart"

const data = [
  { day: "Mon", sent: 412 },
  { day: "Tue", sent: 538 },
  { day: "Wed", sent: 497 },
]

const config = { sent: { label: "Emails sent", color: "var(--chart-1)" } } satisfies ChartConfig

export function TrafficChart() {
  return (
    <ChartContainer config={config} className="h-40 w-80" data-testid="traffic-chart">
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <Bar dataKey="sent" fill="var(--color-sent)" isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}
