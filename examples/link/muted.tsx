import { Link } from "@booleanpress/ui/link"

export default function LinkMuted() {
  return (
    <footer className="flex flex-wrap gap-x-4 gap-y-1">
      <Link href="#privacy" variant="muted" size="sm">
        Privacy
      </Link>
      <Link href="#terms" variant="muted" size="sm">
        Terms
      </Link>
      <Link href="#support" variant="muted" size="sm">
        Support
      </Link>
    </footer>
  )
}
