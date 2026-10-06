import type { ComponentDoc } from "../types.ts"

export default {
  slug: "timeline",
  title: "Timeline",
  category: "Data",
  purpose: "Shows a sequence of events in order, each a marker on a line with its content beside it.",
  links: {
    spec: "specs/004_full-suite-components.md#timeline",
  },
  usage: `\`\`\`tsx
<Timeline aria-label="Ticket history">
  <TimelineItem>
    <TimelineSeparator />
    <TimelineContent>Ticket opened</TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineSeparator />
    <TimelineContent>Resolved</TimelineContent>
  </TimelineItem>
</Timeline>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A ticket's history: a marker per event, joined by a line." },
    {
      id: "alignment",
      title: "Alignment",
      description: "`align` puts the content after the line, before it or on alternate sides.",
    },
    {
      id: "opposite",
      title: "Opposite",
      description: "`TimelineOpposite` puts each event's time on the other side of the line.",
    },
    {
      id: "horizontal",
      title: "Horizontal",
      description: "`orientation=\"horizontal\"` runs the events across the page.",
    },
    {
      id: "custom-markers",
      title: "Custom markers",
      description: "Icon markers with a status colour, and the content in cards on alternate sides.",
    },
    {
      id: "activity-feed",
      title: "Activity feed",
      description: "Avatars as markers, with times formatted in the provider's locale.",
    },
  ],
  accessibility: {
    semantics: "An ordered list (`ol`) with one list item (`li`) per event, so a screen reader announces each event's place.",
    labels: "Name the list with `aria-label` when the heading above it does not. Put times in a `time` element with `dateTime`.",
    focus: "The timeline takes no focus. Links and buttons inside the content are tab stops in reading order.",
    limits: [
      "The separator is hidden from assistive technology. When a marker's colour or icon means something (failed, done), say it in the content too, for example in visually hidden text.",
      "Custom markers of different sizes put the line in different places from event to event when the line is at the edge; keep markers one size, or add opposite content so the line is centred.",
      "A horizontal timeline does not scroll or wrap. Keep it to a few short steps, or switch to vertical on narrow screens.",
    ],
  },
  keyboard: [],
  theming:
    "The marker is a 16 px ring of `--border` on `--card` with a 6 px dot of `--primary`; the connector is a 2 px `--border` line. Content is 14 px `--foreground`, opposite content `--muted-foreground`. A custom marker takes any token classes, such as `bg-success text-success-foreground`.",
  props: {
    TimelineMarker: {
      children: "Replaces the dot: an icon, initials or an image. Size and colour the marker with `className`.",
    },
    TimelineSeparator: {
      children: "A custom marker and connector. Without children it draws the default `TimelineMarker` and `TimelineConnector`.",
    },
  },
} satisfies ComponentDoc
