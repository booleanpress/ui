import type { ComponentDoc } from "../types.ts"

export default {
  slug: "data-view",
  title: "Data view",
  category: "Data",
  purpose: "Shows a collection of items as rows or as cards in a grid, with sorting, pages, loading and an empty state.",
  links: {
    apg: { label: "APG Radio Group", href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/" },
    spec: "specs/004_full-suite-components.md#data-view",
  },
  usage: `\`\`\`tsx
<DataView
  aria-label="Mailers"
  items={mailers}
  getItemKey={(mailer) => mailer.id}
  renderItem={(mailer) => <MailerRow mailer={mailer} />}
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A list of mailers, one per row." },
    { id: "grid", title: "Grid", description: "`defaultLayout=\"grid\"` draws each mailer as a card." },
    {
      id: "layout-toggle",
      title: "Layout",
      description: "`layoutToggle` adds a switch between list and grid.",
    },
    {
      id: "sorting",
      title: "Sorting",
      description: "`sortOptions` adds a select of sort orders to the header.",
    },
    { id: "pagination", title: "Pagination", description: "`pageSize` splits 23 tickets into pages, with page links in the footer." },
    { id: "loading", title: "Loading", description: "`loading` with no items yet shows placeholder cards." },
    {
      id: "refreshing",
      title: "Refreshing",
      description: "`loading` with items keeps them in place, dimmed, until the new ones arrive.",
    },
    { id: "empty", title: "Empty", description: "`empty` replaces the default message with one that offers the next step." },
    { id: "error", title: "Error", description: "An error is an empty state too: say what failed and offer to try again." },
  ],
  accessibility: {
    semantics:
      "The items are a list with one list item each, in both layouts. The layout switch is a radio group, and the pages are a `nav` landmark.",
    labels:
      "Name the list with `aria-label` or `aria-labelledby`. Name every control inside an item after its item, such as \"Edit Transactional\".",
    focus:
      "The data view takes no focus of its own. Tab moves through the sort select, the layout switch, the controls in the items and the pages.",
    limits: [
      "Changing the layout or the page does not move focus or announce anything beyond the controls' own state. Announce a new page with your own status text if it matters, such as `PaginationRange` from Pagination.",
      "The grid is a visual arrangement: arrow keys do not move between cards. Each card's controls are reached with Tab.",
      "The placeholders are hidden from assistive technology; only the status text is read.",
      "Safari's VoiceOver does not announce a list drawn without bullets as a list, so it reads the items one after another without a count.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the sort select, the layout switch, each item's controls and the pages, in that order." },
    { keys: ["ArrowRight"], behaviour: "In the layout switch, chooses the next layout (the previous one in a right-to-left page)." },
    { keys: ["ArrowLeft"], behaviour: "In the layout switch, chooses the previous layout (the next one in a right-to-left page)." },
    { keys: ["Enter"], behaviour: "On the sort select, opens the options; on an option, chooses it and sorts; on a page, shows that page." },
    { keys: ["ArrowDown"], behaviour: "On the sort select, opens the options; in the options, moves to the next one." },
    { keys: ["Escape"], behaviour: "Closes the sort options without changing the order." },
  ],
  theming:
    "Rows are divided by 1 px `--border` lines; the header and footer are set off by the same line. The placeholders are `Skeleton` blocks; the empty text is `--muted-foreground`. The switch, select and pages take the look of `SegmentedControl`, `Select` and `Pagination`.",
  props: {
    DataViewLayoutToggle: {
      dir: "The reading direction, for the arrow keys. Defaults to the provider's `dir`.",
      disabled: "Turns the switch off.",
    },
    DataViewSort: {
      disabled: "Turns the select off.",
    },
  },
} satisfies ComponentDoc
