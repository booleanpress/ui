import { Button } from "@booleanpress/ui/button"
import { Popover, PopoverContent, PopoverDescription, PopoverTrigger } from "@booleanpress/ui/popover"

const SIDES = ["top", "right", "bottom", "left"] as const

export default function PopoverPlacement() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {SIDES.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} align="center" className="w-48">
            <PopoverDescription>Opens on the {side} side, and flips when there is no room.</PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
