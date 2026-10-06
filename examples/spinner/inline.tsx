import { Spinner } from "@booleanpress/ui/spinner"

export default function SpinnerInline() {
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner />
      Checking the connection…
    </p>
  )
}
