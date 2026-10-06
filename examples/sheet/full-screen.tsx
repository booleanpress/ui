import { Button } from "@booleanpress/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@booleanpress/ui/sheet"

const STATS = [
  { label: "Sent", value: "12,480" },
  { label: "Delivered", value: "12,431" },
  { label: "Bounced", value: "37" },
  { label: "Complaints", value: "2" },
]

export default function SheetFullScreen() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open the October report</Button>
      </SheetTrigger>
      <SheetContent side="bottom" size="full">
        <SheetHeader>
          <SheetTitle>October delivery report</SheetTitle>
          <SheetDescription>Every email sent from 1 to 31 October 2026.</SheetDescription>
        </SheetHeader>
        <dl className="grid flex-1 content-start gap-3 px-4.5 pb-4.5 sm:grid-cols-4">
          {STATS.map(({ label, value }) => (
            <div key={label} className="rounded-lg border p-4">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-2xl/normal font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </SheetContent>
    </Sheet>
  )
}
