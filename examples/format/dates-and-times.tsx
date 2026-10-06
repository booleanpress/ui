import { FormatDate } from "@booleanpress/ui/format"

// An instant from the API, and the time zone of the site it belongs to.
const SCHEDULED = "2026-10-14T09:30:00Z"
const ZONE = "Europe/London"

export default function FormatDatesAndTimes() {
  return (
    <dl className="grid w-full max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm/normal">
      <dt className="text-muted-foreground">Medium date</dt>
      <dd>
        <FormatDate value={SCHEDULED} timeZone={ZONE} />
      </dd>
      <dt className="text-muted-foreground">Full date</dt>
      <dd>
        <FormatDate value={SCHEDULED} dateStyle="full" timeZone={ZONE} />
      </dd>
      <dt className="text-muted-foreground">Date and time</dt>
      <dd>
        <FormatDate value={SCHEDULED} dateStyle="medium" timeStyle="short" timeZone={ZONE} />
      </dd>
      <dt className="text-muted-foreground">Time only</dt>
      <dd>
        <FormatDate value={SCHEDULED} timeStyle="short" timeZone={ZONE} />
      </dd>
      <dt className="text-muted-foreground">Your own fields</dt>
      <dd>
        <FormatDate value={SCHEDULED} weekday="short" day="numeric" month="short" hour="numeric" minute="2-digit" timeZone={ZONE} />
      </dd>
      <dt className="text-muted-foreground">A calendar day</dt>
      <dd>
        <FormatDate value="2026-10-31" dateStyle="long" />
      </dd>
    </dl>
  )
}
