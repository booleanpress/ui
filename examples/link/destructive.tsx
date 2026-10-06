import { Link } from "@booleanpress/ui/link"

export default function LinkDestructive() {
  return (
    <p className="text-sm text-muted-foreground">
      This organisation has no active mailers.{" "}
      <Link href="#delete-organisation" variant="destructive">
        Delete the organisation
      </Link>
    </p>
  )
}
