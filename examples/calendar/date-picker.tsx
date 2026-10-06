import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Calendar } from "@booleanpress/ui/calendar"
import { Label } from "@booleanpress/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@booleanpress/ui/popover"

export default function CalendarDatePicker() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 14))

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="send-date">Send on</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="send-date"
            variant="outline"
            className="justify-between border-control bg-field px-2.5 font-normal text-foreground shadow-xs hover:border-control-hover hover:bg-field hover:text-foreground data-[state=open]:border-ring"
          >
            {date ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Pick a date"}
            <CalendarIcon className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-md p-0 shadow-md" align="start" sideOffset={2} aria-label="Choose a date">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(next) => {
              setDate(next)
              setOpen(false)
            }}
            defaultMonth={date ?? new Date(2026, 9)}
            today={new Date(2026, 9, 3)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
