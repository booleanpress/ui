import { BooleanUIProvider } from "@booleanpress/ui/provider"
import { FormatDate } from "@booleanpress/ui/format"

// One send, at one instant, shown where each team works.
const SENT = "2026-10-14T09:30:00Z"
const offices = [
  { city: "Berlin", timeZone: "Europe/Berlin" },
  { city: "New York", timeZone: "America/New_York" },
  { city: "Tokyo", timeZone: "Asia/Tokyo" },
]

export default function FormatTimeZone() {
  return (
    <dl className="grid w-full max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm/normal">
      {offices.map((office) => (
        <BooleanUIProvider key={office.city} locale="en-US" timeZone={office.timeZone}>
          <dt className="text-muted-foreground">{office.city}</dt>
          <dd>
            <FormatDate value={SENT} dateStyle="medium" timeStyle="short" />
          </dd>
        </BooleanUIProvider>
      ))}
      <dt className="text-muted-foreground">UTC, by prop</dt>
      <dd>
        <FormatDate value={SENT} dateStyle="medium" timeStyle="long" timeZone="UTC" />
      </dd>
    </dl>
  )
}
