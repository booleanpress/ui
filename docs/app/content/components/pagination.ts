import type { ComponentDoc } from "../types.ts"

export default {
  slug: "pagination",
  title: "Pagination",
  category: "Data",
  purpose: "Moves between the pages of a list, such as the email log.",
  links: {
    apg: { label: "APG Landmarks: navigation", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html" },
    spec: "specs/003_moved-components.md#pagination",
  },
  usage: `\`\`\`tsx
<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
    <PaginationItem><PaginationLink href="?page=2" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
  </PaginationContent>
</Pagination>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Previous, three numbered pages with the second current, and Next." },
    { id: "with-ellipsis", title: "With ellipsis", description: "A long list shows the first and last page, the pages around the current one, and an ellipsis for each gap." },
    { id: "first-and-last-page", title: "First page", description: "On the first page, Previous is dimmed and skipped by Tab." },
    { id: "as-buttons", title: "As buttons", description: "The links change state instead of the address, for a single-page app." },
    { id: "first-and-last", title: "First and last", description: "`showEdges` adds First and Last links around Previous and Next." },
    { id: "siblings", title: "Siblings", description: "`siblings` sets how many pages show on each side of the current one." },
    { id: "full-bar", title: "Full bar", description: "The range of rows, the pages, the page size and a jump field together." },
    { id: "range-text", title: "Range text", description: "`PaginationRange` says which rows the page shows, and announces it when it changes." },
    { id: "rows-per-page", title: "Rows per page", description: "A page size select; a new size goes back to page 1." },
    { id: "jump-to-page", title: "Jump to page", description: "Type a page number and press Enter." },
  ],
  accessibility: {
    semantics:
      'A `nav` landmark holding a list of links; the current page has `aria-current="page"`. `PaginationRange` is a `role="status"` live region.',
    labels:
      "Add `aria-label=\"Page 2\"` to a number if the meaning is unclear. Give each pagination its own `aria-label` when a page has more than one.",
    focus: "Every link is a tab stop. Previous on the first page and Next on the last are skipped by Tab.",
    limits: [
      "`PaginationLink` has no disabled state. When you write the links yourself, dim the first or last page's link, remove it from the tab order (`tabIndex={-1}`) and set `aria-disabled=\"true\"`, as the First page example does; `PaginationPages` does this for you.",
      "Previous and Next show only a chevron; their accessible name comes from the `previousPage` and `nextPage` strings, and the `previous` and `next` labels stay in the page for screen readers. First and Last show a double chevron, named by `firstPage` and `lastPage`.",
      "A change of page is announced only through `PaginationRange`, a polite live region. Without it, move focus to the list heading, or announce the new page yourself.",
      "The jump field goes to its page on Enter only; leaving it puts the current page back, so tabbing through never changes the page.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves focus to the next link." },
    { keys: ["Shift", "Tab"], behaviour: "Moves focus to the previous link." },
    { keys: ["Enter"], behaviour: "Follows the focused link. In the jump field, goes to the page typed. On the rows-per-page select, opens its list; in the list, chooses the focused number." },
    { keys: ["ArrowDown"], behaviour: "In the open rows-per-page list, moves to the next number. The select has every key of [Select](/components/select)." },
  ],
  theming: "Pages are round, in `--muted-foreground`, and take `bg-accent` on hover; the current page is `bg-highlight` with `text-highlight-foreground`. The chevrons and double chevrons turn around in a right-to-left page, so Previous and First always point the way a reader goes back.",
  props: {
    PaginationLink: {
      isActive: "Marks the current page: the highlight fill and `aria-current=\"page\"`.",
      size: "The button size (`icon` by default; `default`, `sm`, `lg` and the other button sizes).",
    },
  },
} satisfies ComponentDoc
