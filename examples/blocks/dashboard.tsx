import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  InboxIcon,
  LayoutDashboardIcon,
  MailCheckIcon,
  MailIcon,
  MailWarningIcon,
  MousePointerClickIcon,
  PlugIcon,
  RouteIcon,
  SendIcon,
  SettingsIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { Badge } from "@booleanpress/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@booleanpress/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@booleanpress/ui/chart"
import { PageHeader, PageHeaderAction, PageHeaderActions, PageHeaderDescription, PageHeaderHeading, PageHeaderTitle } from "@booleanpress/ui/page-header"
import { useUiLocale } from "@booleanpress/ui/provider"
import { Separator } from "@booleanpress/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@booleanpress/ui/sidebar"
import { Statistic, StatisticGroup } from "@booleanpress/ui/statistic"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"
import { Timeline, TimelineContent, TimelineItem, TimelineSeparator } from "@booleanpress/ui/timeline"

const PAGES = [
  { title: "Overview", icon: LayoutDashboardIcon, active: true },
  { title: "Email log", icon: MailIcon, badge: 12 },
  { title: "Mailers", icon: PlugIcon },
  { title: "Routing rules", icon: RouteIcon },
  { title: "Settings", icon: SettingsIcon },
]

// The week shown, as calendar days (formatted in UTC, so every time zone sees the same days).
const DAYS = [
  { day: "2026-09-28", delivered: 1840, bounced: 21 },
  { day: "2026-09-29", delivered: 2105, bounced: 17 },
  { day: "2026-09-30", delivered: 1962, bounced: 9 },
  { day: "2026-10-01", delivered: 2290, bounced: 24 },
  { day: "2026-10-02", delivered: 2011, bounced: 8 },
  { day: "2026-10-03", delivered: 1218, bounced: 4 },
  { day: "2026-10-04", delivered: 896, bounced: 3 },
]

const chartConfig = {
  delivered: { label: "Delivered", color: "var(--chart-2)" },
  bounced: { label: "Bounced", color: "var(--chart-1)" },
} satisfies ChartConfig

// A fixed "now", so the times read the same on every visit.
const NOW = Date.parse("2026-10-05T12:00:00Z")
const ACTIVITY = [
  { text: "Postmark took over 14 emails while Amazon SES was slow", at: "2026-10-05T11:42:00Z" },
  { text: "Priya Shah changed the sender to hello@northwind.example", at: "2026-10-05T09:05:00Z" },
  { text: "Bounce rate for outlook.com rose to 2.1%", at: "2026-10-04T17:30:00Z" },
  { text: "Tom Becker added the routing rule “Invoices go through Postmark”", at: "2026-10-03T14:10:00Z" },
]

const MAILERS = [
  { name: "Amazon SES", role: "Primary", tone: "success", sent: 10912, failed: 0.004 },
  { name: "Postmark", role: "Fallback", tone: "info", sent: 1384, failed: 0.011 },
  { name: "Office SMTP", role: "Paused", tone: "secondary", sent: 112, failed: 0.036 },
] as const

export default function DashboardBlock() {
  const { locale } = useUiLocale()
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" })
  // Two dates rather than formatRange, whose spacing differs between the ICU of Node and of browsers, so the server's
  // text would not match the browser's at hydration.
  const first = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" })
  const last = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  const count = new Intl.NumberFormat(locale)
  const percent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 })
  const ago = (iso: string) => {
    const minutes = Math.round((Date.parse(iso) - NOW) / 60000)
    if (Math.abs(minutes) < 60) return relative.format(minutes, "minute")
    if (Math.abs(minutes) < 1440) return relative.format(Math.round(minutes / 60), "hour")
    return relative.format(Math.round(minutes / 1440), "day")
  }
  const data = DAYS.map((d) => ({ ...d, label: weekday.format(new Date(d.day)) }))

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <nav aria-label="Acme" className="flex min-h-0 flex-1 flex-col">
          <SidebarHeader className="flex-row items-center gap-2 px-4 py-3 text-sm font-semibold">
            <SendIcon className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate group-data-[collapsible=icon]:hidden">Acme</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Delivery</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PAGES.map((page) => (
                    <SidebarMenuItem key={page.title}>
                      <SidebarMenuButton isActive={page.active} tooltip={page.title}>
                        <page.icon />
                        <span>{page.title}</span>
                      </SidebarMenuButton>
                      {page.badge ? <SidebarMenuBadge>{page.badge}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="flex-row items-center gap-2 p-3">
            <Avatar className="size-8">
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col text-xs group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">Priya Shah</span>
              <span className="truncate text-muted-foreground">priya@northwind.example</span>
            </span>
          </SidebarFooter>
          <SidebarRail />
        </nav>
      </Sidebar>

      <SidebarInset className="min-w-0">
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Overview</span>
        </header>

        <div className="flex flex-col gap-6 p-4 md:p-6">
          <PageHeader>
            <PageHeaderHeading>
              <PageHeaderTitle>Overview</PageHeaderTitle>
            </PageHeaderHeading>
            <PageHeaderDescription>
              Delivery from {first.format(new Date(DAYS[0].day))} to {last.format(new Date(DAYS[DAYS.length - 1].day))}.
            </PageHeaderDescription>
            <PageHeaderActions>
              <PageHeaderAction icon={<SendIcon />} pinned>
                Send a test email
              </PageHeaderAction>
            </PageHeaderActions>
          </PageHeader>

          {/* Four across from about 750px, beside the sidebar; one above another on a phone. */}
          <StatisticGroup className="grid-cols-[repeat(auto-fit,minmax(min(10.5rem,100%),1fr))]">
            <Statistic label="Sent" value={12408} trend="up" trendValue={0.124} helpText="since last week" icon={<InboxIcon />} iconClassName="bg-info-tag text-info-tag-foreground" />
            <Statistic label="Delivered" value={0.966} format="percent" trend="up" trendValue={0.004} helpText="since last week" icon={<MailCheckIcon />} iconClassName="bg-success-tag text-success-tag-foreground" />
            <Statistic label="Opened" value={0.412} format="percent" trend="down" trendValue={0.018} helpText="since last week" icon={<MousePointerClickIcon />} iconClassName="bg-secondary text-secondary-foreground" />
            <Statistic label="Bounced" value={86} trend="down" trendValue={0.3} invertTrendColor helpText="since last week" icon={<MailWarningIcon />} iconClassName="bg-warning-tag text-warning-tag-foreground" />
          </StatisticGroup>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="min-w-0 lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  <h2>Deliveries</h2>
                </CardTitle>
                <CardDescription>Delivered and bounced emails per day.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ChartContainer config={chartConfig} className="aspect-auto h-full min-h-56 w-full">
                  <AreaChart data={data} margin={{ left: 0, right: 8 }} accessibilityLayer>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={40} tickFormatter={(value: number) => count.format(value)} />
                    <ChartTooltip isAnimationActive={false} content={<ChartTooltipContent indicator="line" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area dataKey="delivered" type="monotone" stroke="var(--color-delivered)" fill="var(--color-delivered)" fillOpacity={0.2} isAnimationActive={false} />
                    <Area dataKey="bounced" type="monotone" stroke="var(--color-bounced)" fill="var(--color-bounced)" fillOpacity={0.2} isAnimationActive={false} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>
                  <h2>Recent activity</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline aria-label="Recent activity">
                  {ACTIVITY.map((item) => (
                    <TimelineItem key={item.at}>
                      <TimelineSeparator />
                      <TimelineContent className="pb-4">
                        <p className="text-sm">{item.text}</p>
                        <time dateTime={item.at} className="text-xs text-muted-foreground">
                          {ago(item.at)}
                        </time>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                <h2>Mailers</h2>
              </CardTitle>
              <CardDescription>The services that sent this week&apos;s email.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mailer</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-end">Sent</TableHead>
                    <TableHead className="text-end">Failed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MAILERS.map((mailer) => (
                    <TableRow key={mailer.name}>
                      <TableCell className="font-medium">{mailer.name}</TableCell>
                      <TableCell>
                        <Badge variant={mailer.tone}>{mailer.role}</Badge>
                      </TableCell>
                      <TableCell className="text-end tabular-nums">{count.format(mailer.sent)}</TableCell>
                      <TableCell className="text-end tabular-nums">{percent.format(mailer.failed)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
