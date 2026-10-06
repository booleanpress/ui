import { Timeline, TimelineContent, TimelineItem, TimelineSeparator, type TimelineAlign } from "@booleanpress/ui/timeline"

const STEPS = ["Queued", "Sending", "Delivered", "Opened"]
const ALIGNS: TimelineAlign[] = ["start", "end", "alternate"]

export default function TimelineAlignment() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      {ALIGNS.map((align) => (
        <Timeline key={align} align={align} aria-label={`Message status, content aligned ${align}`}>
          {STEPS.map((step) => (
            <TimelineItem key={step}>
              <TimelineSeparator />
              <TimelineContent>{step}</TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ))}
    </div>
  )
}
