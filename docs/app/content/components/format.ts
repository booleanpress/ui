import type { ComponentDoc } from "../types.ts"

export default {
  slug: "format",
  title: "Format",
  category: "Misc",
  purpose: "Writes numbers, amounts of money, file sizes, dates and relative times in the reader's locale and time zone.",
  links: {
    spec: "specs/004_full-suite-components.md#format",
  },
  usage: `\`\`\`tsx
<p>
  <FormatNumber value={log.recipients} /> recipients, <FormatBytes value={log.size} />, sent{" "}
  <FormatRelativeTime value={log.sentAt} live /> (
  <FormatDate value={log.sentAt} dateStyle="medium" timeStyle="short" />)
</p>
\`\`\``,
  examples: [
    {
      id: "numbers",
      title: "Numbers",
      description: "`FormatNumber` as a plain number, percentage, compact count, unit and signed change.",
    },
    {
      id: "currency",
      title: "Currency",
      description: "`FormatCurrency` in three currencies, including an accounting-style refund.",
    },
    {
      id: "bytes",
      title: "Bytes",
      description: "`FormatBytes` in steps of 1,000 or, with `units=\"binary\"`, of 1,024.",
    },
    {
      id: "dates-and-times",
      title: "Dates and times",
      description: "`FormatDate` with date and time styles, and a date-only value.",
    },
    {
      id: "relative-time",
      title: "Relative time",
      description: "`FormatRelativeTime` from seconds ago to a future date.",
    },
    {
      id: "another-locale",
      title: "Another locale",
      description: "The same figures under German and Arabic (Egypt) locales.",
    },
    {
      id: "time-zone",
      title: "Time zone",
      description: "One moment written in three time zones and in UTC.",
    },
  ],
  accessibility: {
    semantics:
      "A number, amount or size is a `data` element holding the raw value; a date or relative time is a `time` element holding the ISO date.",
    labels:
      "A formatted value has no name of its own: place it next to words that say what it is, such as a table heading.",
    focus: "The parts take no focus.",
    limits: [
      "A live relative time changes its text every minute without announcing it; that is on purpose, as a ticking announcement would interrupt. Wrap it in your own `aria-live` region if a change must be heard.",
      "Unit symbols and short styles (\"KB\", \"3 hr. ago\") are read as screen readers expand them, which varies, and a bare \"B\" is easy to miss. Use `unitDisplay=\"long\"` or `style=\"long\"` where the full word matters.",
      "The entry is a client module (it reads the provider), so a React Server Component cannot call the plain functions from it; call `Intl` there instead.",
      "An invalid date or a NaN writes nothing, and the element keeps no `value` or `dateTime`.",
    ],
  },
  keyboard: [],
  theming:
    "The parts draw nothing of their own: they take the font and colour of the text around them. Add `tabular-nums` (`font-variant-numeric: tabular-nums`) where figures line up in a column.",
  props: {
    FormatNumber: {
      locale: "Writes this value in another locale than the provider's.",
    },
    FormatCurrency: {
      locale: "Writes this value in another locale than the provider's.",
    },
    FormatBytes: {
      locale: "Writes this value in another locale than the provider's.",
    },
    FormatDate: {
      locale: "Writes this value in another locale than the provider's.",
      timeZone: "The IANA time zone to write the date in (`\"Europe/Berlin\"`). Defaults to the provider's `timeZone`, else the browser's.",
    },
    FormatRelativeTime: {
      locale: "Writes this value in another locale than the provider's.",
    },
  },
} satisfies ComponentDoc
