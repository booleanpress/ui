import { CalendarDaysIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { Button } from "@booleanpress/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@booleanpress/ui/hover-card"

export default function HoverCardBasic() {
  return (
    <p className="text-sm/normal text-muted-foreground">
      Ticket assigned to{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="h-auto p-0 align-baseline">
            Maya Okafor
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="flex gap-3">
            <Avatar size="lg">
              <AvatarFallback>MO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-foreground">Maya Okafor</p>
              <p className="text-muted-foreground">Support lead, billing queue. Answers within two hours on weekdays.</p>
              <p className="flex items-center gap-1.5 text-xs/normal text-muted-foreground">
                <CalendarDaysIcon aria-hidden="true" className="size-3.5" />
                Joined October 2026
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </p>
  )
}
