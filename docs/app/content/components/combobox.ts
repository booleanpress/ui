import type { ComponentDoc } from "../types.ts"

export default {
  slug: "combobox",
  title: "Combobox",
  category: "Form",
  purpose: "A text field that filters a list as people type, so they choose one option, or several as chips, from many.",
  links: {
    apg: {
      label: "APG Combobox (list autocomplete)",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/",
    },
    spec: "specs/004_full-suite-components.md#combobox",
  },
  peers: ["@base-ui/react"],
  usage: `\`\`\`tsx
<Label htmlFor="mailer">Mailer</Label>
<Combobox items={MAILERS} defaultValue="Postmark">
  <ComboboxInput id="mailer" placeholder="Search mailers" />
  <ComboboxContent>
    <ComboboxEmpty />
    <ComboboxList>
      {(mailer: string) => (
        <ComboboxItem key={mailer} value={mailer}>
          {mailer}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A field that filters the mailers as you type." },
    { id: "trigger", title: "With trigger button", description: "A chevron button opens and closes the whole list; object options show their `label`." },
    { id: "multiple", title: "Multiple", description: "`multiple` with `ComboboxChips` shows each choice as a chip in the field." },
    { id: "custom-option", title: "Custom option", description: "Options with an avatar and a second line of text." },
    { id: "groups", title: "Groups", description: "Options in labelled groups; filtering keeps the groups that still match." },
    { id: "clear", title: "Clear", description: "`showClear` adds a button that empties the field." },
    { id: "async", title: "Async", description: "Results load from a server as you type, with a spinner and a message if the request fails." },
    { id: "virtualised", title: "Virtualised", description: "A list of 1,000 options that only draws the ones in view." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "`variant=\"filled\"` gives a filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "A disabled field keeps its value and does not open." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "in-dialog", title: "In a dialog", description: "Inside a `Dialog`, a click picks an option and the dialog stays open; Escape closes the list first." },
  ],
  accessibility: {
    semantics:
      'The input is a `combobox` that controls a `listbox`; the highlighted option is announced as you move, and the chosen one is `aria-selected`. Focus stays in the input while the list is open.',
    labels:
      "Name the input with a `Label`, `aria-label` or `aria-labelledby`; the name is still read while the list is open. Groups are named by their label.",
    focus:
      "The input is the only tab stop; the chevron, clear button and chip remove buttons are for the pointer. In `multiple`, the arrow keys move from the input to the chips and back.",
    limits: [
      "The value must be an option. Free text needs `Autocomplete` or `TagsInput`.",
      "Typing filters with Base UI's locale-aware `contains` match; pass `filter` for another rule.",
    ],
  },
  keyboard: [
    { keys: ["ArrowDown"], behaviour: "Opens the list, then highlights the next option." },
    { keys: ["ArrowUp"], behaviour: "Highlights the previous option." },
    { keys: ["Enter"], behaviour: "Chooses the highlighted option, fills the field and closes the list." },
    { keys: ["Escape"], behaviour: "Closes the list without choosing; inside a dialog, the dialog stays open." },
    { keys: ["Home", "End"], behaviour: "Move the text cursor to the start or the end of the field, as in any text field." },
    { keys: ["A–Z"], behaviour: "Typing filters the options; nothing matching shows \"No results\"." },
    { keys: ["Backspace"], behaviour: "With `multiple`, in an empty input, removes the last chip." },
  ],
  theming:
    "The field is `InputGroup`: `--field` (`--field-filled` with `variant=\"filled\"`), `--control` for the edge (`--control-hover` under the pointer), `--ring` on focus and `--invalid` when invalid; the chevron and clear icons are `--control-hover`. The list uses `--popover`, `--accent` for the highlighted option and `--highlight` for the chosen one (`--highlight-focus` while highlighted). Chips use `--secondary`. The list's motion is set once in `theme.css`.",
  props: {
    Combobox: {
      items: "The options: a flat array, or groups of `{ value, items }`. Filtering and `ComboboxList`'s function child read them.",
      value: "The chosen value, when you control it (an array with `multiple`). Pair it with `onValueChange`.",
      defaultValue: "The value it starts with, when it controls itself.",
      onValueChange: "Called with the new value when an option is chosen or cleared.",
      multiple: "Lets people choose several options, shown as chips.",
      filter: "The rule that matches an option against the text; `null` shows every option, for results filtered elsewhere.",
      itemToStringLabel: "Turns an object option into the text the field shows. Options shaped `{ value, label }` need none.",
      onInputValueChange: "Called as the text changes, with a `reason`; use it to load results.",
      open: "Whether the list is open, when you control it. Pair it with `onOpenChange`.",
      onOpenChange: "Called when the list opens or closes.",
      disabled: "Stops the combobox from opening or changing.",
      virtualized: "Tells Base UI the options are rendered by a virtualiser; give each `ComboboxItem` its `index`.",
      autoHighlight: "Highlights the first match while typing, so Enter chooses it.",
      name: "The field name, for the value the form submits.",
    },
    ComboboxInput: {
      size: "`sm` is 26 px high, `default` 34 px, `lg` 42 px. Defaults to the provider's `controlSize`.",
      variant: "`default` is the white field; `filled` the grey `--field-filled` one. Defaults to the provider's `fieldVariant`.",
      showTrigger: "Shows the chevron cell at the end, which opens and closes the list. On by default.",
      showClear: "Shows a clear button while a value is chosen.",
      loading: "Shows a spinner in the field while results load.",
      disabled: "Disables the input and its buttons; pair it with `disabled` on the root.",
    },
    ComboboxContent: {
      anchor: "The element the list lines up with: the `ComboboxChips` field, from `useComboboxAnchor`. Defaults to the input.",
      side: "Which side of the field the list prefers. It flips when there is no room.",
      sideOffset: "Distance in pixels between the field and the list. Defaults to 2.",
      align: "How the list lines up with the field: `start`, `center` or `end`.",
      container: "The element the list is portalled into. Defaults to `<body>`.",
    },
    ComboboxItem: {
      value: "The value this option chooses.",
      icon: "Leading media beside both lines, such as an avatar.",
      description: "A second, muted line under the label.",
      disabled: "The option cannot be highlighted or chosen.",
      index: "The option's position, required when the list is virtualised.",
    },
    ComboboxStatus: {
      loading: "Shows a spinner and the provider's \"Loading results…\".",
    },
    ComboboxChips: {
      size: "`sm`, `default` or `lg`, for the field, its chips and its input.",
      variant: "`default` or `filled`.",
    },
    ComboboxChip: {
      label: "The chip's text for its remove button's name, when its children are not plain text.",
      showRemove: "Shows the remove button. On by default.",
    },
  },
} satisfies ComponentDoc
