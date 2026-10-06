import type { ComponentDoc } from "../types.ts"

export default {
  slug: "order-list",
  title: "Order list",
  category: "Data",
  purpose: "A list people put in order: they choose items, then move them with buttons, Alt and the arrow keys, or by dragging.",
  links: {
    apg: { label: "APG Listbox", href: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" },
    spec: "specs/004_full-suite-components.md#order-list",
  },
  peers: ["@dnd-kit/core", "@dnd-kit/sortable"],
  usage: `\`\`\`tsx
const [rules, setRules] = useState(initial)

<OrderList header="Routing rules" value={rules} onValueChange={setRules} draggable />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Choose a rule, then move it with the buttons or with Alt and the arrow keys." },
    { id: "drag-and-drop", title: "Drag and drop", description: "`draggable` lets you drag an item to a new place, or move it with the keyboard." },
    { id: "drag-handle", title: "Drag handle", description: "A grip on each item; only the grip starts a pointer drag." },
    { id: "checkbox", title: "Multiple selection with checkboxes", description: "A checkbox on every item; the Move buttons move all chosen items together." },
    { id: "filter", title: "Filter", description: "A filter field narrows the items in view, and moves leave the hidden ones in place." },
    { id: "empty", title: "Empty placeholder", description: "With no items the list shows a message." },
    { id: "disabled", title: "Disabled", description: "A disabled list keeps its order and is skipped by Tab." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
  ],
  accessibility: {
    semantics:
      'The list is a `listbox` of `option` items. The Move buttons are named buttons, and every move is read out in a polite live region.',
    labels:
      "Name the list with `header`, `aria-label` or `aria-labelledby`.",
    focus:
      "The buttons, the filter field and the list are separate tab stops. A drag never moves focus.",
    limits: [
      "A pointer drag moves one item; the buttons and Alt with the arrows move every chosen item.",
      "Items are always in the page. A key press redraws only the items it changes, so a list of 5,000 keeps up with the keyboard; choosing every item, and each move in a draggable list, redraws them all. Beyond a few thousand, page or filter them on the server. A `renderItem` written inline is new on each render of its parent and redraws every item then: in a long list, define it outside the component or with `useCallback`.",
      "Alt with the arrow keys can be taken by a screen reader or the browser in some set-ups; the buttons always work (WCAG 2.5.7).",
    ],
  },
  keyboard: [
    { keys: ["ArrowDown", "ArrowUp"], behaviour: "Move the highlight to the next or the previous item, stopping at the ends." },
    { keys: ["Home", "End"], behaviour: "Move the highlight to the first or the last item." },
    { keys: ["Space"], behaviour: "Chooses the highlighted item, or un-chooses it." },
    { keys: ["Shift", "ArrowDown"], behaviour: "Moves the highlight and chooses every item from the last one chosen to it (Shift and ArrowUp, Home or End too)." },
    { keys: ["Shift", "Space"], behaviour: "Chooses every item from the last one chosen to the highlighted one." },
    { keys: ["Control", "A"], behaviour: "Chooses every item in view, or none when all are chosen (⌘ and A on a Mac)." },
    { keys: ["Alt", "ArrowUp"], behaviour: "Moves the chosen items (or the highlighted one) one place up; Alt and ArrowDown one place down." },
    { keys: ["Alt", "Home"], behaviour: "Moves the chosen items to the top; Alt and End to the bottom." },
    { keys: ["Enter"], behaviour: "With `draggable`, picks the highlighted item up; the arrow keys then move it, Space or Enter drops it and Escape puts it back." },
    { keys: ["A–Z"], behaviour: "Type-ahead: moves the highlight to the next item whose label starts with the letters typed." },
    { keys: ["ArrowDown"], behaviour: "In the filter field, moves the focus to the list." },
  ],
  theming:
    "The frame takes the field tokens: `--field`, `--control` for the edge, `--ring` while the list has focus, `--invalid` when invalid and `--field-disabled` when disabled. Items use `--accent` under the pointer and while highlighted, and `--highlight` once chosen (`--highlight-focus` both). The buttons are the small secondary icon buttons. A dragged item lifts onto `--popover` with the overlay shadow; its place stays at half strength.",
  props: {
    OrderList: {
      value: "The items in order, when you control them. Pair it with `onValueChange`.",
      defaultValue: "The items in their first order, when the list controls itself.",
      onValueChange: "Called with the items in their new order after every move.",
      selected: "The chosen items' keys, when you control them.",
      controls: "`start` (default), `end` or `none`: where the Move buttons sit.",
      indicator: "`none` (the fill only) or `checkbox`.",
      disabled: "Greys the list and its buttons and takes the list out of the tab order.",
    },
    OrderListGroup: {
      children: "The `OrderList`s that share dragging; each keeps its own value.",
    },
  },
} satisfies ComponentDoc
