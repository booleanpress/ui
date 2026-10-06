import { Timeline, TimelineContent, TimelineItem, TimelineSeparator, type TimelineAlign } from "@booleanpress/ui/timeline"

const STEPS = ["Queued", "Sent", "Delivered", "Opened"]
const ALIGNS: TimelineAlign[] = ["start", "end", "alternate"]

export default function TimelineHorizontal() {
  return (
    <div className="flex w-full flex-col gap-6">
      {ALIGNS.map((align) => (
        <Timeline key={align} orientation="horizontal" align={align} aria-label={`Delivery steps, content aligned ${align}`}>
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
