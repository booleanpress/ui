import { useUiLocale } from "@booleanpress/ui/provider"
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineOpposite,
  TimelineSeparator,
} from "@booleanpress/ui/timeline"

const EVENTS = [
  { status: "Queued", at: "2026-10-15T10:30:00Z" },
  { status: "Sent", at: "2026-10-15T10:31:00Z" },
  { status: "Delivered", at: "2026-10-15T10:32:00Z" },
  { status: "Opened", at: "2026-10-16T08:05:00Z" },
]

export default function TimelineOppositeContent() {
  const { locale, timeZone } = useUiLocale()
  const format = new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short", timeZone: timeZone ?? "UTC" })

  return (
    <Timeline aria-label="Delivery of the welcome email" className="w-full max-w-md">
      {EVENTS.map((event) => (
        <TimelineItem key={event.status}>
          <TimelineOpposite className="text-xs/normal">
            <time dateTime={event.at}>{format.format(new Date(event.at))}</time>
          </TimelineOpposite>
          <TimelineSeparator />
          <TimelineContent>{event.status}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
