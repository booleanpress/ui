import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

// Days with scheduled deliveries get a dot, and say so to screen readers in the day's name.
const deliveries = [2, 6, 9, 13, 16, 22, 27, 29].map((day) => new Date(2026, 9, day))

export default function DatePickerDateTemplate() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="delivery-day">Delivery day</Label>
      <DatePicker
        id="delivery-day"
        defaultMonth={new Date(2026, 9)}
        today={new Date(2026, 9, 3)}
        calendarProps={{
          modifiers: { delivery: deliveries },
          modifiersClassNames: {
            delivery: "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-1 after:mx-auto after:size-1 after:rounded-full after:bg-info",
          },
          // Your own day names replace the built-in ones, so they say "Today" and "selected" themselves.
          labels: {
            labelDayButton: (date, modifiers) =>
              [
                modifiers.today ? "Today" : "",
                date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
                modifiers.delivery ? "deliveries scheduled" : "",
                modifiers.selected ? "selected" : "",
              ]
                .filter(Boolean)
                .join(", "),
          },
        }}
      />
    </div>
  )
}
