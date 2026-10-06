import { Link } from "@booleanpress/ui/link"

export default function LinkDisabled() {
  return (
    <div className="flex flex-col items-start gap-1">
      <Link href="#export" disabled size="default">
        Export the log
      </Link>
      <p className="text-xs text-muted-foreground">Export is available once the first delivery is logged.</p>
    </div>
  )
}
