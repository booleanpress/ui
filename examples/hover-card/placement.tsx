import { Button } from "@booleanpress/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@booleanpress/ui/hover-card"

const SIDES = [
  { side: "top", label: "Top" },
  { side: "right", label: "Right" },
  { side: "bottom", label: "Bottom" },
  { side: "left", label: "Left" },
] as const

export default function HoverCardPlacement() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SIDES.map(({ side, label }) => (
        <HoverCard key={side}>
          <HoverCardTrigger asChild>
            <Button variant="outline">{label}</Button>
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-56">
            <p className="font-semibold text-foreground">Primary connection</p>
            <p className="text-muted-foreground">Amazon SES, eu-west-1. Last test passed at 09:41.</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}
