import { CheckIcon, MailIcon, SendIcon, TriangleAlertIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@booleanpress/ui/card"
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineMarker,
  TimelineOpposite,
  TimelineSeparator,
} from "@booleanpress/ui/timeline"

const EVENTS = [
  { title: "Campaign scheduled", time: "15 Oct, 09:00", text: "The October newsletter is queued for 4,200 subscribers.", Icon: MailIcon, tone: "bg-primary text-primary-foreground" },
  { title: "Sending started", time: "15 Oct, 10:00", text: "Batches of 500 go out every five minutes through the primary mailer.", Icon: SendIcon, tone: "bg-info-solid text-info-solid-foreground" },
  { title: "Rate limit reached", time: "15 Oct, 10:25", text: "The mailer paused for ten minutes, then resumed on its own.", Icon: TriangleAlertIcon, tone: "bg-warning-solid text-warning-solid-foreground" },
  { title: "Campaign sent", time: "15 Oct, 10:55", text: "4,186 delivered, 14 bounced.", Icon: CheckIcon, tone: "bg-success text-success-foreground" },
]

export default function TimelineCustomMarkers() {
  return (
    <Timeline align="alternate" aria-label="Newsletter campaign" className="w-full">
      {EVENTS.map(({ title, time, text, Icon, tone }) => (
        <TimelineItem key={title}>
          <TimelineOpposite>{time}</TimelineOpposite>
          <TimelineSeparator>
            <TimelineMarker className={`size-10 border-0 ${tone} [&_svg:not([class*='size-'])]:size-4`}>
              <Icon />
            </TimelineMarker>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Card className="gap-2 border">
              <CardHeader>
                <CardTitle className="text-base/normal">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{text}</CardContent>
            </Card>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
