import { Button } from "@booleanpress/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@booleanpress/ui/hover-card"

const TIMINGS = [
  { label: "Instant", openDelay: 0, closeDelay: 0, text: "Opens and closes at once." },
  { label: "Default", openDelay: 700, closeDelay: 300, text: "Opens after 0.7 seconds and closes 0.3 seconds after the pointer leaves." },
  { label: "Slow", openDelay: 1500, closeDelay: 500, text: "Opens after 1.5 seconds and closes half a second after the pointer leaves." },
]

export default function HoverCardDelay() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {TIMINGS.map(({ label, openDelay, closeDelay, text }) => (
        <HoverCard key={label} openDelay={openDelay} closeDelay={closeDelay}>
          <HoverCardTrigger asChild>
            <Button variant="outline">{label}</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-56">{text}</HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}
