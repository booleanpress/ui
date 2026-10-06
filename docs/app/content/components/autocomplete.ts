import type { ComponentDoc } from "../types.ts"

export default {
  slug: "autocomplete",
  title: "Autocomplete",
  category: "Form",
  purpose: "A text field that suggests values as people type; they may pick a suggestion or keep their own text.",
  links: {
    apg: {
      label: "APG Combobox (list autocomplete)",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/",
    },
    spec: "specs/004_full-suite-components.md#autocomplete",
  },
  peers: ["@base-ui/react"],
  usage: `\`\`\`tsx
<Autocomplete items={tags}>
  <AutocompleteInput placeholder="Type a tag" />
  <AutocompleteContent>
    <AutocompleteList>
      {(tag: string) => (
        <AutocompleteItem key={tag} value={tag}>
          {tag}
        </AutocompleteItem>
      )}
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Suggestions narrow as you type; text that matches none is kept." },
    { id: "force-selection", title: "Force selection", description: "Text that matches no suggestion is cleared when the field loses focus." },
    { id: "chips", title: "Chips", description: "Picked suggestions become removable chips, using Combobox in multiple mode." },
    { id: "focus-policy", title: "Focus policy", description: "Focusing the field selects its text and opens the suggestions." },
    { id: "arrow", title: "Arrow", description: "An arrow points from the list to the field." },

    { id: "inline", title: "Inline completion", description: "`mode=\"both\"` writes the highlighted suggestion into the field as you move through the list." },
    { id: "async", title: "Async", description: "Suggestions load from a server as you type, with a loading state and an error message." },
    { id: "groups", title: "Groups", description: "Suggestions in labelled groups, with a message when nothing matches." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "A disabled field keeps its text and suggests nothing." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
  ],
  accessibility: {
    semantics:
      'The input is a `combobox` that controls a `listbox` of suggestions; the highlighted suggestion is announced as you move through the list, while focus stays in the input.',
    labels: "Name the input with a `Label`, `aria-label` or `aria-labelledby`. The name is still read while the list is open.",
    focus: "The input is the only tab stop. The clear button and the chevron are for the pointer; the keyboard does the same with typing and the arrow keys.",
    limits: [
      "Suggestions are not a selection: nothing is marked chosen in the list.",
    ],
  },
  keyboard: [
    { keys: ["ArrowDown"], behaviour: "Opens the suggestions, then highlights the next one." },
    { keys: ["ArrowUp"], behaviour: "Highlights the previous suggestion." },
    { keys: ["Enter"], behaviour: "Fills the field with the highlighted suggestion and closes the list." },
    { keys: ["Escape"], behaviour: "Closes the list and keeps the text; inside a dialog, the dialog stays open." },
    { keys: ["Home", "End"], behaviour: "Move the text cursor to the start or the end of the field." },
    { keys: ["A–Z"], behaviour: "Typing narrows the suggestions; with `mode=\"both\"` the highlighted one is written in." },
  ],
  theming:
    "The field is `InputGroup`: `--field` (`--field-filled` filled), `--control` for the edge, `--ring` on focus, `--invalid` when invalid, icons in `--control-hover`. The list uses `--popover` and `--accent` for the highlighted suggestion; its motion is set once in `theme.css`.",
  props: {
    Autocomplete: {
      items: "The suggestions: a flat array, or groups of `{ value, items }`.",
      value: "The field's text, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The text it starts with, when it controls itself.",
      onValueChange: "Called with the new text and a `reason`, as people type or pick a suggestion.",
      mode: "`list` (the default) filters the suggestions; `both` also writes the highlighted one into the field; `inline` and `none` keep the list as given.",
      filter: "The rule that matches a suggestion against the text; `null` shows them as given.",
      itemToStringValue: "Turns an object suggestion into the text it puts in the field. `{ value, label }` objects need none.",
      openOnInputClick: "Opens the suggestions when the field is clicked. Off by default.",
      autoHighlight: "Highlights the first suggestion while typing, so Enter takes it.",
      disabled: "Stops the field from changing or suggesting.",
      name: "The field name, for the text the form submits.",
    },
    AutocompleteArrow: {
      className: "Styles the positioned popup arrow. Render it inside AutocompleteContent and use sideOffset={8} on the content.",
    },
    AutocompleteInput: {
      size: "`sm` is 26 px high, `default` 34 px, `lg` 42 px. Defaults to the provider's `controlSize`.",
      variant: "`default` is the white field; `filled` the grey `--field-filled` one. Defaults to the provider's `fieldVariant`.",
      showClear: "Shows a clear button while the field has text.",
      showTrigger: "Shows a chevron cell that opens the whole list.",
      loading: "Shows a spinner in the field while suggestions load.",
      disabled: "Disables the input and its buttons; pair it with `disabled` on the root.",
    },
    AutocompleteContent: {
      side: "Which side of the field the list prefers. It flips when there is no room.",
      sideOffset: "Distance in pixels between the field and the list. Defaults to 2.",
      align: "How the list lines up with the field: `start`, `center` or `end`.",
      container: "The element the list is portalled into. Defaults to `<body>`.",
    },
    AutocompleteItem: {
      value: "The suggestion; its text fills the field when it is picked.",
      icon: "Leading media beside both lines.",
      description: "A second, muted line under the label.",
    },
    AutocompleteStatus: {
      loading: "Shows a spinner and the provider's \"Loading results…\".",
    },
  },
} satisfies ComponentDoc
