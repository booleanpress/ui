import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { useUiLocale } from "@booleanpress/ui/provider"
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineOpposite,
  TimelineSeparator,
} from "@booleanpress/ui/timeline"

// A fixed "now", so the relative times read the same on every render.
const NOW = Date.parse("2026-10-15T12:00:00Z")

const ACTIVITY = [
  { who: "Priya Shah", initials: "PS", action: "replied to ticket #2041", detail: "Sent the new SMTP credentials and asked for a test.", at: "2026-10-15T11:58:00Z" },
  { who: "Tom Becker", initials: "TB", action: "added the mailer Postmark", detail: "Set as the fallback for transactional email.", at: "2026-10-15T11:45:00Z" },
  { who: "Lena Ortiz", initials: "LO", action: "rotated the API key", detail: "The old key stops working on 22 October.", at: "2026-10-15T09:00:00Z" },
  { who: "Sam Okafor", initials: "SO", action: "closed ticket #2033", detail: "Bounce notices were going to an old address.", at: "2026-10-14T16:20:00Z" },
]

function relative(format: Intl.RelativeTimeFormat, iso: string) {
  const minutes = Math.round((Date.parse(iso) - NOW) / 60000)
  if (Math.abs(minutes) < 60) return format.format(minutes, "minute")
  if (Math.abs(minutes) < 1440) return format.format(Math.round(minutes / 60), "hour")
  return format.format(Math.round(minutes / 1440), "day")
}

export default function TimelineActivityFeed() {
  const { locale } = useUiLocale()
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  return (
    <Timeline aria-label="Recent activity" className="w-full max-w-lg">
      {ACTIVITY.map((item) => (
        <TimelineItem key={item.at}>
          <TimelineOpposite className="pt-1 text-xs/normal">
            <time dateTime={item.at}>{relative(format, item.at)}</time>
          </TimelineOpposite>
          <TimelineSeparator>
            <Avatar>
              <AvatarFallback>{item.initials}</AvatarFallback>
            </Avatar>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className="pt-1">
            <p>
              <span className="font-medium">{item.who}</span> <span className="text-muted-foreground">{item.action}</span>
            </p>
            <p className="mt-1 text-muted-foreground">{item.detail}</p>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
