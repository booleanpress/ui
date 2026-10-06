import type { ComponentDoc } from "../types.ts"

export default {
  slug: "tabs",
  title: "Tabs",
  category: "Panel",
  purpose: "Shows one panel of content at a time, chosen from a row of tabs.",
  links: {
    radix: { label: "Radix Tabs", href: "https://www.radix-ui.com/primitives/docs/components/tabs" },
    apg: { label: "APG Tabs", href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" },
    spec: "specs/002_pilot-mini-specs.md#tabs",
  },
  usage: `\`\`\`tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="logs">Logs</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Delivered today: 1,284</TabsContent>
  <TabsContent value="logs">The 50 most recent emails.</TabsContent>
</Tabs>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Three tabs, the first selected, each with its own panel." },
    { id: "controlled", title: "Controlled", description: "Your state holds the selection, and a button outside the tabs can change it." },
    {
      id: "scrollable",
      title: "Scrollable",
      description: "`scrollable` keeps a long row of tabs on one line, with buttons to scroll it.",
    },
    {
      id: "manual-activation",
      title: "Manual activation",
      description: "With `activationMode=\"manual\"`, the arrow keys move focus and Enter or Space selects.",
    },
    { id: "disabled", title: "Disabled", description: "A disabled tab keeps its place but cannot be selected." },
    {
      id: "custom-indicator",
      title: "Custom indicator",
      description: "`TabsIndicator` is one bar that slides to the selected tab.",
    },
    {
      id: "closable",
      title: "Closable",
      description: "`onClose` adds an × to a tab and lets Delete close it; the + button opens a new tab.",
    },
    { id: "line", title: "Line", description: "`variant=\"line\"` draws a thicker bar under the selected tab and no line under the list." },
    { id: "vertical", title: "Vertical", description: "`orientation=\"vertical\"` stacks the tabs, and Up and Down Arrow move between them." },
  ],
  accessibility: {
    semantics: "A `tablist` of `tab` buttons and a `tabpanel` named by its tab.",
    labels: "The text of each tab is its name; name an icon-only tab with `aria-label`. Give each `TabsList` an `aria-label` when a page has more than one.",
    focus: "The tab list is one tab stop, and the arrow keys move between tabs. Tab then moves into the active panel.",
    limits: [
      "Selecting happens as focus moves (automatic activation). A panel that is slow to load should not be a tab: set `activationMode=\"manual\"` on `Tabs` so the arrow keys move focus and Enter or Space selects.",
      "The selected tab is shown by its colour and the bar along the list's edge: 1px in `default`, 2px in `line`. The state is also in `aria-selected`.",
      "The scroll buttons of a `scrollable` list are pointer controls, kept out of the tab order: the list stays one tab stop, and the arrow keys bring each tab into view. Screen readers can still reach them by their names (`scrollTabsBackward`, `scrollTabsForward`).",
      "A button cannot sit inside a tab, so the × of a closable tab is hidden from assistive technology; its `title` names it (`closeTab`, \"Close {label}\") for the pointer. Keyboard users close the focused tab with Delete or Backspace, which the tab announces through `aria-keyshortcuts=\"Delete\"`. `aria-keyshortcuts` is not read by every screen reader, so offer a close action inside the panel as well when closing matters.",
      "Closing the last tab leaves nothing to take focus; move it to a sensible place yourself, such as the button that opens a new tab.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves focus into the tab list, onto the selected tab, then into the active panel." },
    { keys: ["Right Arrow"], behaviour: "Moves to and selects the next tab, wrapping from the last to the first. In a scrollable list it brings that tab into view." },
    { keys: ["Left Arrow"], behaviour: "Moves to and selects the previous tab, wrapping from the first to the last." },
    { keys: ["Down Arrow", "Up Arrow"], behaviour: "In a vertical list, moves to the next or previous tab." },
    { keys: ["Home"], behaviour: "Moves to the first tab." },
    { keys: ["End"], behaviour: "Moves to the last tab." },
    { keys: ["Enter"], behaviour: "With `activationMode=\"manual\"`, selects the focused tab." },
    { keys: ["Space"], behaviour: "With `activationMode=\"manual\"`, selects the focused tab." },
    { keys: ["Delete"], behaviour: "On a closable tab, closes it; the neighbour takes focus, and the selection when the closed tab had it. Backspace does the same." },
  ],
  theming: "The list has no fill, so it sits on any surface; the line under it is `--border`. Inactive labels are `text-muted-foreground` and turn `--foreground` on hover; the selected tab and its bar are `--primary`, as is `TabsIndicator`. The panel is padded so its text lines up with the labels. The scroll buttons of a `scrollable` list are `--background` with a soft glow of it over the tabs they cover, `text-muted-foreground` turning `--foreground` on hover; a list on a card needs `[data-slot=tabs-scroll-button]` given the card's fill. The × of a closable tab is muted, with a round `--accent` fill on hover.",
  props: {
    Tabs: {
      value: "The selected tab, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The tab selected first, when it controls itself.",
      onValueChange: "Called with the new value when a tab is selected.",
      orientation: "`horizontal` (default) or `vertical`: it sets which arrow keys move between tabs.",
      activationMode: "`automatic` (default) selects a tab when it takes focus; `manual` selects it on Enter or Space.",
      dir: "The reading direction. It follows the provider's `dir` unless set here.",
    },
    TabsList: {
      variant: "`default` draws a 1px line under the list and a 1px bar under the selected tab; `line` leaves out the line and draws a 2px bar.",
      loop: "Whether the arrow keys wrap from the last tab to the first. `true` by default.",
    },
    TabsTrigger: {
      value: "Ties the tab to the `TabsContent` with the same value.",
      disabled: "Skips the tab with the arrow keys and ignores clicks.",
    },
    TabsContent: {
      value: "Shows this panel while the tab with the same value is selected.",
      forceMount: "Keeps the panel in the page when it is not selected. Radix hides it with the `hidden` attribute; use it to keep the state of a panel that is not showing.",
    },
  },
} satisfies ComponentDoc
