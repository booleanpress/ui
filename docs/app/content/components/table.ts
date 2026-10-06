import type { ComponentDoc } from "../types.ts"

export default {
  slug: "table",
  title: "Table",
  category: "Data",
  purpose: "Shows rows of records in aligned columns, such as emails, tickets or people.",
  links: {
    apg: { label: "APG Table", href: "https://www.w3.org/WAI/ARIA/apg/patterns/table/" },
    spec: "specs/003_moved-components.md#table",
  },
  usage: `\`\`\`tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Recipient</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>ana@example.com</TableCell>
      <TableCell>Delivered</TableCell>
    </TableRow>
  </TableBody>
</Table>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A header row, body rows and a status badge in a cell." },
    { id: "caption-and-footer", title: "Caption and footer", description: "`TableCaption` names the table; `TableFooter` holds the totals." },
    { id: "selectable-rows", title: "Selectable rows", description: "Row checkboxes and a select-all box that shows a dash when only some rows are chosen." },
    { id: "empty", title: "Empty", description: "One cell spans every column and says why there are no rows." },
    { id: "horizontal-scroll", title: "Horizontal scroll", description: "In a narrow space the table scrolls sideways." },
  ],
  accessibility: {
    semantics: "Native `table`, `thead`, `tbody`, `tr`, `th` and `td`, so a screen reader announces the row and column of each cell.",
    labels: "Name the table with a `TableCaption` or `aria-label`. Give row checkboxes an `aria-label` that says what they select, and an empty header cell visually hidden text.",
    focus: "The table has no tab stop of its own. Controls inside cells are tab stops in reading order.",
    limits: [
      "Selection is shown by colour alone. The fill tells a sighted person which rows are chosen; the checkbox state (`aria-checked`) tells everyone else. Keep a checkbox in each selectable row.",
      "A table wider than its box scrolls sideways. When nothing inside it can take focus, the scroll container becomes a tab stop so the arrow keys scroll it; when a control inside can, focusing the control scrolls the table to it.",
      "There is no sorting or `aria-sort`. Add `aria-sort` on the `TableHead` you sort by.",
      "Cells do not wrap (`whitespace-nowrap`). Long text makes the table scroll; add `whitespace-normal` to a cell that should wrap.",
    ],
  },
  keyboard: [],
  theming: "Rows are separated by 1px `--border` lines (`--muted` in the dark theme, a subtler line). A row takes `bg-accent` on hover, and a selected row is `bg-highlight` with `text-highlight-foreground`. Header and footer cells are semibold on the table's own surface.",
} satisfies ComponentDoc
