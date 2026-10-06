import { ScrollTop } from "@booleanpress/ui/scroll-top"

const PARAGRAPHS = [
  "Each email the site sends is written to the delivery log: the recipient, the subject, the status and the mail server's reply.",
  "Failed emails are retried after 5 minutes, 30 minutes and 2 hours. Each attempt gets its own line.",
  "Entries are kept for 30 days, then deleted. Export the log as CSV to keep it longer.",
  "Filter by status, by connection or by date. A filter stays in the address, so a filtered view can be shared.",
  "Open an entry to see the message's headers and body, and to resend it through any connection.",
  "Bounces and complaints reported by the provider are matched to their entry and shown beside it.",
]

export default function ScrollTopElement() {
  return (
    // The scrolling box takes focus, so it can be scrolled from the keyboard; the button scrolls it and returns focus to it.
    <div
      tabIndex={0}
      role="region"
      aria-label="About the delivery log"
      className="h-60 w-full max-w-sm overflow-y-auto rounded-md border p-4 text-sm outline-none focus-visible:border-ring"
    >
      {PARAGRAPHS.map((text) => (
        <p key={text} className="mb-4">
          {text}
        </p>
      ))}
      <ScrollTop target="parent" threshold={100} className="size-9 [&_svg:not([class*='size-'])]:size-3.5" />
    </div>
  )
}
