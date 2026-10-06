import { Link } from "@booleanpress/ui/link"

export default function LinkExternal() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Link href="https://example.com/docs/smtp" external size="default">
        SMTP setup guide
      </Link>
      <Link href="https://example.com/status" external variant="muted" size="sm">
        Service status
      </Link>
    </div>
  )
}
