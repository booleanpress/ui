import { FormatNumber } from "@booleanpress/ui/format"

export default function FormatNumbers() {
  return (
    <dl className="grid w-full max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm/normal">
      <dt className="text-muted-foreground">Emails sent</dt>
      <dd className="text-end tabular-nums">
        <FormatNumber value={1240861} />
      </dd>
      <dt className="text-muted-foreground">Open rate</dt>
      <dd className="text-end tabular-nums">
        <FormatNumber value={0.4286} style="percent" maximumFractionDigits={1} />
      </dd>
      <dt className="text-muted-foreground">Subscribers</dt>
      <dd className="text-end tabular-nums">
        <FormatNumber value={48250} style="compact" />
      </dd>
      <dt className="text-muted-foreground">Average send time</dt>
      <dd className="text-end tabular-nums">
        <FormatNumber value={245} style="unit" unit="millisecond" />
      </dd>
      <dt className="text-muted-foreground">Change since last week</dt>
      <dd className="text-end tabular-nums">
        <FormatNumber value={0.031} style="percent" signDisplay="exceptZero" maximumFractionDigits={1} />
      </dd>
    </dl>
  )
}
