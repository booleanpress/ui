import { ArrowUpToLineIcon } from "lucide-react"
import { ScrollTop } from "@booleanpress/ui/scroll-top"

const PARAGRAPHS = [
  "An API key belongs to one organisation and carries scopes: send, read logs, or manage connections.",
  "A key is shown once, when it is created. Store it in your secrets manager, never in the code.",
  "Rotate a key by creating a new one, moving your sites to it, then revoking the old one.",
  "A revoked key stops working at once. Requests with it get a 401 reply and are logged.",
  "Keys that have not been used for 90 days are flagged on the API keys page.",
  "Every request names its key in the audit log, with the address it came from.",
]

export default function ScrollTopCustomIcon() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="About API keys"
      className="h-60 w-full max-w-sm overflow-y-auto rounded-md border p-4 text-sm outline-none focus-visible:border-ring"
    >
      {PARAGRAPHS.map((text) => (
        <p key={text} className="mb-4">
          {text}
        </p>
      ))}
      <ScrollTop
        target="parent"
        threshold={100}
        variant="secondary"
        icon={<ArrowUpToLineIcon />}
        className="size-9 [&_svg:not([class*='size-'])]:size-4"
      />
    </div>
  )
}
