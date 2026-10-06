import type { ComponentDoc } from "../types.ts"

export default {
  slug: "data-table",
  title: "Data table",
  category: "Data",
  purpose: "Shows records in a table people can sort, filter, page, select, expand, group, edit and rearrange.",
  links: {
    apg: { label: "APG Table", href: "https://www.w3.org/WAI/ARIA/apg/patterns/table/" },
    spec: "specs/004_full-suite-components.md#data-table",
  },
  peers: ["@tanstack/react-table", "@tanstack/react-virtual"],
  usage: `\`\`\`tsx
const columns: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "status", header: "Status" },
]

<DataTable
  aria-label="Deliveries"
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  sorting
  filtering
  pagination
  selection="multiple"
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Columns and rows with no features turned on." },
    { id: "sizes", title: "Sizes", description: "`size` sets the row density: small, default or large." },
    { id: "gridlines", title: "Gridlines", description: "`gridlines` draws a border around every cell." },
    { id: "striped", title: "Striped", description: "`striped` shades every other row." },
    {
      id: "single-selection",
      title: "Single selection",
      description: "`selection=\"single\"` adds a radio to each row, so one row can be chosen.",
    },
    {
      id: "multiple-selection",
      title: "Multiple selection",
      description: "`selection=\"multiple\"` adds checkboxes and a select-all box; Shift chooses a range.",
    },
    { id: "sort", title: "Sort", description: "`sorting` makes each title a sort button; Shift adds a second column." },
    { id: "pagination", title: "Pagination", description: "`pagination` splits the rows into pages, with a paginator under the table." },
    {
      id: "scroll",
      title: "Scroll",
      description: "`stickyHeader` keeps the header in view, and a pinned column stays put while the table scrolls sideways.",
    },
    { id: "row-expansion", title: "Row expansion", description: "`renderSubRow` adds an expand button that shows a row's details." },
    {
      id: "cell-editing",
      title: "Cell editing",
      description: "Cells edit in place: Enter or F2 starts, Enter saves, Escape cancels.",
    },
    {
      id: "row-grouping",
      title: "Row grouping",
      description: "`grouping` puts rows under a header row per mailer, with a total for each group.",
    },
    {
      id: "column-resize",
      title: "Column resize",
      description: "`columnResizing` lets you drag a column's edge, or use the arrow keys on its handle.",
    },
    {
      id: "column-reorder",
      title: "Column reorder",
      description: "`columnOrdering` lets you drag a column by its header, or use its menu.",
    },
    {
      id: "row-reorder",
      title: "Row reorder",
      description: "Drag handles reorder rows; install `@dnd-kit/core` and `@dnd-kit/sortable` first.",
    },
    {
      id: "column-visibility",
      title: "Column visibility",
      description: "`columnVisibility` adds a Columns menu above the table and a Hide item to each column's menu.",
    },
    { id: "column-groups", title: "Column groups", description: "Grouped columns make a second header row, and `footer` adds a totals row." },
    {
      id: "filter",
      title: "Filter",
      description: "`filtering` adds a search field over every column and a filter row under the headers.",
    },
    { id: "export-csv", title: "Export CSV", description: "`exportCsv` adds a button that saves the filtered rows as a CSV file." },
    {
      id: "server-mode",
      title: "Server mode",
      description: "Sorting, filtering and paging are done by a server that answers each change.",
    },
    {
      id: "loading",
      title: "Loading",
      description: "`loading` shows a spinner while rows refresh, and skeleton rows before the first ones arrive.",
    },
    { id: "empty", title: "Empty", description: "`empty` replaces the body when there are no rows." },
    {
      id: "virtual-rows",
      title: "Virtual rows",
      description: "`virtual` draws only the rows in view, so 10,000 deliveries scroll smoothly.",
    },
    {
      id: "advanced",
      title: "Advanced",
      description: "Toolbar, search, sorting, selection, row actions, column controls and pagination together.",
    },
  ],
  accessibility: {
    semantics:
      "A native `table` with column headers, so a screen reader announces each cell with its column. A sortable column's title is a `button`, and its header carries `aria-sort`.",
    labels:
      "Name the table with `aria-label`, `aria-labelledby` or `caption`. Row controls are named after the row, such as \"Select row Ana\"; a live region announces sorting, filter results and page changes.",
    focus:
      "The table is not a tab stop; its controls are, in reading order. After an edit, focus returns to the cell, and Escape in an editor cancels only that.",
    limits: [
      "It is a table, not an ARIA grid: there is no arrow-key navigation between cells. Each control is a tab stop instead. A grid model needs a spec of its own (spec standard §6.1).",
      "Selection is shown by the highlight and by the checkbox or radio; keep the selection column, as a press on the row alone is not keyboard accessible.",
      "Dragging a column header uses the browser's drag and drop, which keyboards and many screen readers cannot use; Move left and Move right in the column menu do the same by keyboard.",
      "In a `ReorderableDataTable`, rows move in the order of `data`: the drag handles rest while the table is sorted or grouped, with virtual rows, and until `onRowOrderChange` is given. A row moves within its page; sub-rows do not move.",
      "Virtual rows must keep one height (`virtual.rowHeight`, else the size's row height). Row expansion and grouping are not virtualised, and a grouped table with `virtual` draws no group footer (its totals): leave `virtual` off for a grouped table that shows totals.",
      "\"{count} results\" is one string for every number; translations that need plural forms should word it to fit any count.",
      "Exported CSV writes raw values, not what `cell` draws; set `meta.exportValue` for a different text. A text that starts like a formula (`=`, `+`, `-`, `@`, a tab or a line break) is written with a leading apostrophe, so a spreadsheet shows it and never runs it; plain numbers such as -12.5 are left as they are. The Export CSV button saves the filtered rows of every page; with a server that pages, that is the page in `data`.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "On a column title, sorts by the column: ascending, then descending, then not sorted." },
    { keys: ["Space"], behaviour: "On a column title, sorts the same way. On a row checkbox, selects or deselects the row; on the header box, every row of the page." },
    { keys: ["Shift", "Enter"], behaviour: "On a column title, adds the column to the sort, after the columns already sorted." },
    { keys: ["ArrowDown"], behaviour: "On a single-selection radio, selects the next row (ArrowUp the previous one)." },
    { keys: ["Enter"], behaviour: "On an expand button, expands or collapses the row or the group (Space too)." },
    { keys: ["F2"], behaviour: "On an editable cell, opens its editor (Enter too). In the editor, Enter commits, Escape cancels; both return focus to the cell." },
    { keys: ["ArrowRight"], behaviour: "On a resize handle, widens the column by 10 px (50 px with Shift); ArrowLeft narrows it. Swapped in a right-to-left page." },
    { keys: ["Enter"], behaviour: "On a column's options button, opens its menu: Move left, Move right, Hide column." },
    { keys: ["Space"], behaviour: "In a `ReorderableDataTable`, on a row's drag handle, picks the row up (Enter too); pressed again, drops it in its new place. Each step is announced." },
    { keys: ["ArrowDown"], behaviour: "While a row is picked up, moves it one place down (ArrowUp one place up)." },
    { keys: ["Escape"], behaviour: "While a row is picked up, puts it back where it was." },
  ],
  theming:
    "Header cells sit on `--card` in semibold `--foreground`, 0.5 × 0.875 rem padding (0.125 × 0.375 rem at `sm`, 0.75 × 1.125 rem at `lg`), over a 1 px `--border` line (`--muted` in dark). Rows sit on `--card`, take `--accent` under the pointer and `--highlight` with `--highlight-foreground` when selected; the selected row's lines turn `--accent` (`--card` in dark). `striped` fills every other row with `--subtle` (`--background` in dark). An unsorted arrow is `--muted-foreground`, darker on hover; a sorted one `--foreground`. The resize line and a column drop target are `--primary`. A drag handle is `--control-hover`, `--secondary-foreground` under the pointer; the row being dragged rises with the overlay shadow. The loading mask is `--card` at 50 % with a `--primary` spinner.",
  props: {
    DataTable: {
      columns: "TanStack Table 9 column definitions. Keep the array stable.",
      data: "The rows, or the current page when the server pages. Keep the array stable.",
      state: "The state slices you control, each with its `on…Change`.",
      initialState: "Where the slices the table controls start.",
      tableOptions: "Any other TanStack Table option; it wins over the props.",
    },
  },
} satisfies ComponentDoc
