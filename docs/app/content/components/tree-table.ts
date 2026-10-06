import type { ComponentDoc } from "../types.ts"

export default {
  slug: "tree-table",
  title: "Tree table",
  category: "Data",
  purpose: "A table of nested rows people open, sort, check and page through: organisations, their teams and their people.",
  links: {
    apg: { label: "APG Treegrid", href: "https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/" },
    spec: "specs/004_full-suite-components.md#tree-table",
  },
  usage: `\`\`\`tsx
const columns: TreeTableColumn<Member>[] = [
  { id: "name", header: "Name" },
  { id: "role", header: "Role", sortable: true },
]

<TreeTable aria-label="Members" nodes={rows} columns={columns} />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Organisations, their teams and their people; the first column opens a row into its children." },
    { id: "sizes", title: "Sizes", description: "Small, default and large cell padding." },
    { id: "gridlines", title: "Gridlines", description: "`gridlines` draws an edge round every cell." },
    { id: "striped", title: "Striped", description: "`striped` tints every other row." },
    {
      id: "checkbox-selection",
      title: "Checkbox selection",
      description: "Checking a row checks its branch, and the heading checkbox checks every row.",
    },
    {
      id: "sort",
      title: "Sort",
      description: "Click a `sortable` column heading to sort; siblings sort among themselves.",
    },
    { id: "pagination", title: "Pagination", description: "`pageSize` shows a few top-level rows per page, with pagination below." },
    {
      id: "scroll",
      title: "Scroll",
      description: "`scrollHeight` scrolls the rows under a header that stays in place.",
    },
    { id: "loading", title: "Loading", description: "`loading` dims the rows while they refresh, or draws placeholder rows before the first load." },
    { id: "empty", title: "Empty", description: "`empty` shows your own message in place of the rows." },
    {
      id: "lazy",
      title: "Lazy children",
      description: "`loadChildren` fetches a row's children the first time it opens.",
    },
    { id: "single-selection", title: "Single selection", description: "`selectionMode=\"single\"`: a click selects one row and clears the last." },
    { id: "multiple-selection", title: "Multiple selection", description: "`selectionMode=\"multiple\"`: each click toggles a row." },
  ],
  accessibility: {
    semantics: "A `table` with `role=\"treegrid\"`; rows report their level and open state, and sortable headings use `aria-sort`.",
    labels: "Name the table with `aria-label` or `aria-labelledby`. Row toggles and checkboxes are named from the row's label.",
    focus: "The rows are one tab stop, and the arrow keys move between them. Sortable heading buttons are tab stops of their own.",
    limits: [
      "The focus moves by row, not by cell: interactive content in cells is reached with Tab only when it is in the tab order itself.",
      "It is a tree with columns, not a full table: cell or row editing, column resizing, column reordering, column visibility, column groups, row reordering, a filter row and CSV export are left to Data table, which has each of them. Filter the nodes before passing them.",
    ],
  },
  keyboard: [
    { keys: ["Down Arrow"], behaviour: "Moves to the next row." },
    { keys: ["Up Arrow"], behaviour: "Moves to the previous row." },
    { keys: ["Right Arrow"], behaviour: "Opens a closed row; on an open row, moves to its first child. Left Arrow in a right-to-left page." },
    { keys: ["Left Arrow"], behaviour: "Closes an open row; otherwise moves to its parent. Right Arrow in a right-to-left page." },
    { keys: ["Home"], behaviour: "Moves to the first row." },
    { keys: ["End"], behaviour: "Moves to the last row shown." },
    { keys: ["Enter"], behaviour: "Chooses the row, or checks it with checkboxes; with no selection, opens or closes it." },
    { keys: ["Space"], behaviour: "As Enter." },
    { keys: ["*"], behaviour: "Opens every sibling of the focused row." },
    { keys: ["A–Z"], behaviour: "Moves to the next row whose label starts with the letters typed." },
    { keys: ["Shift", "Down Arrow"], behaviour: "With `multiple`, moves to the next row and adds it to the choice or takes it away. Up Arrow likewise." },
    { keys: ["Control", "A"], behaviour: "With `multiple`, chooses every row shown, or none when all are chosen." },
  ],
  theming:
    "Rows and cells are the Table's: `--border` lines (`--muted` in dark), `--accent` under the pointer, a chosen row `--highlight`. A sorted heading fills `--highlight`; a striped row takes `--subtle` (`--background` in dark). The toggle is `--muted-foreground`, `--accent` under the pointer.",
  props: {
    TreeTable: {
      nodes: "The rows, as tree nodes, with your values in `data`.",
      columns: "`{ id, header, cell?, sortable?, sortValue?, className?, headerClassName? }`; the first holds the tree.",
      selectionMode: "`none` (default), `single`, `multiple` or `checkbox`.",
      sort: "The sort (`{ id, desc }` or `null`), when you control it. Pair it with `onSortChange`.",
      pageSize: "Top-level rows a page; pagination shows below.",
      size: "Cell padding: `sm`, `default` or `lg`. Defaults to the provider's `controlSize`.",
      scrollHeight: "A CSS height past which the rows scroll under a header that stays in place.",
      expandAllButton: "Shows a button in the first heading that opens or closes every row.",
    },
  },
} satisfies ComponentDoc
