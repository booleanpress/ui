import { FormatRelativeTime } from "@booleanpress/ui/format"

// A fixed "now", so the example reads the same every day; leave `now` out (and add `live`) in an app.
const NOW = "2026-10-14T12:00:00Z"

const events = [
  { id: "evt_9f2", text: "Delivered to anna@example.com", at: "2026-10-14T11:59:15Z" },
  { id: "evt_9f1", text: "Opened by mark@example.com", at: "2026-10-14T11:48:00Z" },
  { id: "evt_9e7", text: "Bounced: mailbox full", at: "2026-10-14T09:02:00Z" },
  { id: "evt_9c4", text: "API key rotated", at: "2026-10-13T08:30:00Z" },
  { id: "evt_9a0", text: "Domain verified", at: "2026-09-29T10:00:00Z" },
  { id: "evt_a01", text: "Newsletter scheduled", at: "2026-10-17T09:00:00Z" },
]

export default function FormatRelativeTimeExample() {
  return (
    <ul className="w-full max-w-md divide-y text-sm/normal">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between gap-4 py-2">
          <span>{event.text}</span>
          <FormatRelativeTime value={event.at} now={NOW} className="shrink-0 text-muted-foreground" />
        </li>
      ))}
      <li className="flex items-center justify-between gap-4 py-2">
        <span>Short style, always a number</span>
        <FormatRelativeTime value="2026-10-13T12:00:00Z" now={NOW} numeric="always" style="short" className="shrink-0 text-muted-foreground" />
      </li>
    </ul>
  )
}
