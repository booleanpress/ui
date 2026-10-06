import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@booleanpress/ui/chart"
import { useUiLocale } from "@booleanpress/ui/provider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"

const data = [
  { day: "Mon", sent: 412 },
  { day: "Tue", sent: 538 },
  { day: "Wed", sent: 497 },
  { day: "Thu", sent: 603 },
  { day: "Fri", sent: 365 },
]

const config = { sent: { label: "Emails sent", color: "var(--chart-1)" } } satisfies ChartConfig

export default function ChartTextAlternative() {
  const { locale } = useUiLocale()
  const count = new Intl.NumberFormat(locale)

  return (
    <figure className="flex w-full max-w-lg flex-col gap-3">
      <ChartContainer config={config} className="h-48 w-full" role="img" aria-label="Bar chart of emails sent per weekday. The table below holds the same numbers.">
        {/* One named picture: its keyboard layer is off, so no tab stop hides inside it; the table has the numbers. */}
        <BarChart data={data} margin={{ top: 10, left: 0, right: 8 }} accessibilityLayer={false}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
          <ChartTooltip isAnimationActive={false} cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="sent" fill="var(--color-sent)" radius={4} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead className="text-end">Emails sent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.day}>
              <TableCell>{row.day}</TableCell>
              <TableCell className="text-end tabular-nums">{count.format(row.sent)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </figure>
  )
}
