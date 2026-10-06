import { Link } from "@booleanpress/ui/link"

export default function LinkSizes() {
  return (
    <div className="flex flex-wrap items-baseline gap-4">
      <Link href="#api-keys" size="sm">
        API keys
      </Link>
      <Link href="#api-keys" size="default">
        API keys
      </Link>
      <Link href="#api-keys" size="lg">
        API keys
      </Link>
    </div>
  )
}
