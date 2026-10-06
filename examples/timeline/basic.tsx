import { Timeline, TimelineContent, TimelineItem, TimelineSeparator } from "@booleanpress/ui/timeline"

const HISTORY = ["Ticket opened", "Assigned to Priya", "Customer replied", "Resolved"]

export default function TimelineBasic() {
  return (
    <Timeline aria-label="Ticket history" className="w-full max-w-sm">
      {HISTORY.map((event) => (
        <TimelineItem key={event}>
          <TimelineSeparator />
          <TimelineContent>{event}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
