import type { ComponentDoc } from "../types.ts"

export default {
  slug: "tree",
  title: "Tree",
  category: "Data",
  purpose: "Shows nested items people open, close, choose, check, filter and move: folders, categories, an organisation.",
  links: {
    apg: { label: "APG Tree View", href: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" },
    spec: "specs/004_full-suite-components.md#tree",
  },
  usage: `\`\`\`tsx
<Tree
  aria-label="Mail folders"
  nodes={folders}
  selectionMode="single"
  defaultExpanded={["inbox"]}
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Mail folders, the first one open; a click on a parent opens or closes it." },
    {
      id: "icons-and-counts",
      title: "With icons and counts",
      description: "`icon` and `expandedIcon` draw a folder, and `renderLabel` adds an unread count.",
    },
    {
      id: "toggle-indicator",
      title: "Custom toggle indicator",
      description: "`expandIcon` and `collapseIcon` replace the chevrons with a plus and a minus.",
    },
    {
      id: "controlled",
      title: "Controlled",
      description: "`expanded` and `onExpandedChange` keep the open nodes in your state.",
    },
    {
      id: "single-selection",
      title: "Single selection",
      description: "`selectionMode=\"single\"` chooses one node at a time.",
    },
    {
      id: "multiple-selection",
      title: "Multiple selection",
      description: "`selectionMode=\"multiple\"` lets a click add or remove a node.",
    },
    {
      id: "checkbox-selection",
      title: "Checkbox selection",
      description: "Checking a parent checks its branch, and a partly checked branch shows a dash.",
    },
    {
      id: "filter",
      title: "Filter",
      description: "`filter` keeps the nodes that contain the typed text, with their ancestors open.",
    },
    {
      id: "lazy",
      title: "Lazy loading",
      description: "`loadChildren` fetches a folder's contents the first time it opens.",
    },
    {
      id: "loading",
      title: "Loading",
      description: "`loading` dims the nodes while they refresh, or draws placeholder rows before the first load.",
    },
    { id: "empty", title: "Empty", description: "`empty` shows your own message when there are no nodes." },
    {
      id: "drag-and-drop",
      title: "Drag and drop",
      description: "`DraggableTree` from `@booleanpress/ui/tree-drag` lets people drag a node; it needs `@dnd-kit/core`.",
    },
    {
      id: "disabled",
      title: "Disabled nodes",
      description: "A disabled node can be focused and opened, but not chosen or moved.",
    },
    { id: "move-without-dragging", title: "Move without dragging", description: "A menu on each node moves it for people who cannot drag." },
  ],
  accessibility: {
    semantics: "A `tree` of `treeitem` nodes, with `aria-expanded` on parents and `aria-selected` or `aria-checked` on chosen nodes.",
    labels: "Name the tree with `aria-label` or `aria-labelledby`. A node's name is its label.",
    focus: "The tree is one tab stop, and the arrow keys move between nodes. When a branch closes over the focus, focus moves to its parent.",
    limits: [
      "The chevrons and checkboxes are drawn for the pointer and hidden from assistive technology: the node's own `aria-expanded` and `aria-checked` carry the state.",
      "Dragging (`DraggableTree`) needs a mouse, or a finger held for 250 ms; the keyboard moves nodes with Alt and the arrows. A pointer that cannot drag has no move of its own: offer a menu that calls `moveTreeNode` (WCAG 2.5.7).",
      "`moveTreeNode` moves the nodes you pass. Children that `loadChildren` brought in are kept by the tree until you add them to `nodes`, so moving one of them needs your own update.",
      "Every node shown is drawn: no rows are virtual. A branch of thousands of nodes is best loaded with `loadChildren` or narrowed with the filter.",
      "With a filter, type-ahead and the arrows move among the nodes shown.",
    ],
  },
  keyboard: [
    { keys: ["Down Arrow"], behaviour: "Moves to the next node shown." },
    { keys: ["Up Arrow"], behaviour: "Moves to the previous node shown." },
    { keys: ["Right Arrow"], behaviour: "Opens a closed node; on an open node, moves to its first child. Left Arrow in a right-to-left page." },
    { keys: ["Left Arrow"], behaviour: "Closes an open node; otherwise moves to its parent. Right Arrow in a right-to-left page." },
    { keys: ["Home"], behaviour: "Moves to the first node." },
    { keys: ["End"], behaviour: "Moves to the last node shown." },
    { keys: ["Enter"], behaviour: "Chooses the node, or checks it with checkboxes; with no selection, opens or closes it." },
    { keys: ["Space"], behaviour: "As Enter." },
    { keys: ["*"], behaviour: "Opens every sibling of the focused node." },
    { keys: ["A–Z"], behaviour: "Moves to the next node whose label starts with the letters typed." },
    { keys: ["Shift", "Down Arrow"], behaviour: "With `multiple`, moves to the next node and adds it to the choice or takes it away. Up Arrow likewise." },
    { keys: ["Control", "A"], behaviour: "With `multiple`, chooses every node shown, or none when all are chosen." },
    { keys: ["Alt", "Up Arrow"], behaviour: "With `onNodeMove`, moves the node before its previous sibling. Down Arrow moves it after the next. The live region says its new position." },
    {
      keys: ["Alt", "Right Arrow"],
      behaviour: "With `onNodeMove`, moves the node into its previous sibling, as its last child. Alt and Left Arrow moves it out, after its parent. Flipped in a right-to-left page.",
    },
  ],
  theming:
    "Rows are `--foreground` on the `--card` surface; a node that can be chosen takes `--accent` under the pointer, and a chosen one `--highlight` with `--highlight-foreground`; focus is a 1 px `--ring` outline inside the row. In a `DraggableTree`, a drop line is `--primary`, and the node being dragged has a dashed `--primary` outline.",
  props: {
    Tree: {
      nodes: "The nodes to show: `{ id, label, icon?, expandedIcon?, children?, leaf?, disabled?, data? }`.",
      selectionMode: "`none` (default), `single`, `multiple` or `checkbox`.",
      expanded: "The open nodes' ids, when you control them. Pair it with `onExpandedChange`.",
      defaultExpanded: "The nodes open at first.",
      selected: "The chosen or checked nodes' ids, when you control them. Pair it with `onSelectedChange`.",
      defaultSelected: "The nodes chosen at first.",
      filter: "Shows the filter field above the tree.",
      filterValue: "The filter's text, when you control it. Pair it with `onFilterValueChange`.",
      loading: "Dims the nodes under a spinner, or draws placeholder rows while there are none.",
      empty: "What shows when there are no nodes. Defaults to the provider's `noResults` string.",
      onNodeMove: "Called with each move; enables Alt with the arrows (and, in a `DraggableTree`, dragging). Apply the move with `moveTreeNode`.",
    },
  },
} satisfies ComponentDoc
