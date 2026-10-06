import type { ComponentDoc } from "../types.ts"

export default {
  slug: "pick-list",
  title: "Pick list",
  category: "Data",
  purpose: "Two lists side by side: people move items from one to the other with buttons or by dragging, and put each in order.",
  links: {
    apg: { label: "APG Listbox", href: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" },
    spec: "specs/004_full-suite-components.md#pick-list",
  },
  peers: ["@dnd-kit/core", "@dnd-kit/sortable"],
  usage: `\`\`\`tsx
<PickList
  sourceHeader="Available agents"
  targetHeader="Assigned to Billing"
  source={available}
  onSourceChange={setAvailable}
  target={assigned}
  onTargetChange={setAssigned}
  draggable
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Choose agents, then assign them with the buttons between the lists." },
    { id: "drag-and-drop", title: "Drag and drop", description: "`draggable` lets you drag an item within a list or across to the other." },
    { id: "checkbox", title: "Checkboxes", description: "A checkbox on every item, with a select-all in each list." },
    { id: "filter", title: "Filter", description: "A filter field above each list; Move all moves only the items in view." },
    { id: "empty", title: "Empty placeholders", description: "An empty list shows a message." },
    { id: "disabled", title: "Disabled", description: "Both lists and every button are disabled, so no item moves." },
  ],
  accessibility: {
    semantics:
      'Each list is a `listbox` of `option` items, as in `OrderList`. The transfer buttons are named buttons, and every move is read out in a polite live region.',
    labels:
      "Name the lists with `sourceHeader` and `targetHeader`; otherwise they are named Source and Target.",
    focus:
      "Tab moves through the source's buttons and list, the transfer buttons, then the target's list and buttons. A transfer leaves focus on its button.",
    limits: [
      "Moved items go to the end of the other list; drag one to put it somewhere in particular.",
      "A keyboard drag into the other list lands before the item it is over; to land last, drop it and press Alt and End.",
      "Items are always in the page. A key press redraws only the items it changes, so a list of 5,000 keeps up with the keyboard; choosing every item, and each move in a draggable list, redraws them all. Beyond a few thousand, page or filter them on the server. A `renderItem` written inline is new on each render of its parent and redraws every item then: in a long list, define it outside the component or with `useCallback`.",
    ],
  },
  keyboard: [
    { keys: ["ArrowDown", "ArrowUp"], behaviour: "In a list, move the highlight to the next or the previous item." },
    { keys: ["Home", "End"], behaviour: "In a list, move the highlight to the first or the last item." },
    { keys: ["Space"], behaviour: "In a list, chooses the highlighted item, or un-chooses it; with Shift, chooses the range from the last one chosen." },
    { keys: ["Control", "A"], behaviour: "In a list, chooses every item in view, or none when all are chosen (⌘ and A on a Mac)." },
    { keys: ["Alt", "ArrowUp"], behaviour: "In a list, moves the chosen items one place up; Alt and ArrowDown one place down, Alt and Home or End to the top or the bottom." },
    { keys: ["Enter"], behaviour: "With `draggable`, picks the highlighted item up. ArrowUp and ArrowDown move it in its list; ArrowRight and ArrowLeft take it to the other list; Space or Enter drops it and Escape puts it back." },
    { keys: ["Enter", "Space"], behaviour: "On a transfer button, moves the chosen items (or, for Move all, every item in view) to the end of the other list." },
  ],
  theming:
    "The lists take OrderList's tokens: the field fill and edges, `--accent` while highlighted, `--highlight` once chosen. The transfer and Move buttons are the small secondary icon buttons. A list an item is dragged over from the other one turns its edge `--ring`, and a 2px `--primary` line marks where the item will land.",
  props: {
    PickList: {
      source: "The first list's items, when you control them. Pair it with `onSourceChange`.",
      target: "The second list's items, when you control them. Pair it with `onTargetChange`.",
      indicator: "`none` (the fill only) or `checkbox`.",
      orderControls: "Shows each list's Move up and down buttons.",
      listClassName: "Classes for both lists; defaults to `h-60`.",
      disabled: "Greys both lists and every button.",
    },
  },
} satisfies ComponentDoc
