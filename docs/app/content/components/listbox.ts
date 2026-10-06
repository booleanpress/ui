import type { ComponentDoc } from "../types.ts"

export default {
  slug: "listbox",
  title: "Listbox",
  category: "Form",
  purpose: "A list of options always in view, from which people choose one or several, with an optional filter field.",
  links: {
    apg: { label: "APG Listbox", href: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" },
    spec: "specs/004_full-suite-components.md#listbox",
  },
  usage: `\`\`\`tsx
<Label id="region-label">Sending region</Label>
<Listbox aria-labelledby="region-label" defaultValue="eu-west-1">
  <ListboxItem value="eu-west-1">Europe (Ireland)</ListboxItem>
  <ListboxItem value="us-east-1">US East (N. Virginia)</ListboxItem>
</Listbox>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "One choice from a list that is always in view." },
    { id: "focus-behavior", title: "Focus behavior", description: "Choose whether options are highlighted on focus, selected on focus or followed by the pointer." },
    { id: "meta-key-selection", title: "Modifier selection", description: "A plain click replaces the selection; Ctrl/Cmd-click adds or removes an option." },
    { id: "multiple", title: "Multiple", description: "`multiple` lets people choose several options; the value is an array." },
    { id: "checkbox", title: "Checkbox selection", description: "A checkbox on every option, with a header checkbox that selects all." },
    { id: "groups", title: "Groups", description: "Options in labelled groups, in a list that scrolls." },
    { id: "filter", title: "Filter", description: "A field above the list narrows the options as you type." },
    { id: "custom-option", title: "Custom option", description: "Options with an avatar and a second line of text." },
    { id: "disabled-options", title: "Disabled options", description: "A disabled option stays in view and is skipped by the keyboard." },
    { id: "disabled", title: "Disabled", description: "A disabled list keeps its value and is skipped by Tab." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
  ],
  accessibility: {
    semantics:
      'A `listbox` of `option` items, with `role="group"` for groups. With `filter`, the field is a `combobox` that controls the list.',
    labels:
      "Name the list with `aria-labelledby` or `aria-label`.",
    focus:
      "The list, or its filter field, is one tab stop. The highlighted option is announced while focus stays on the list.",
    limits: [
      "There is no range selection with Shift and no Ctrl+A; each option is toggled on its own.",
      "Options are always in the page: thousands of them belong in a virtualised `Combobox`.",
    ],
  },
  keyboard: [
    { keys: ["ArrowDown", "ArrowUp"], behaviour: "Move the highlight to the next or the previous option, stopping at the ends." },
    { keys: ["Home", "End"], behaviour: "On the list, move the highlight to the first or the last option." },
    { keys: ["Space"], behaviour: "On the list, chooses the highlighted option; with `multiple`, toggles it." },
    { keys: ["Enter"], behaviour: "Chooses the highlighted option; with `multiple`, toggles it. Works from the filter field too." },
    { keys: ["A–Z"], behaviour: "On the list, type-ahead: moves to the next option whose text starts with the letters typed. In the filter field, narrows the options." },
  ],
  theming:
    "The frame takes the field tokens: `--field`, `--control` for the edge, `--ring` while it has focus, `--invalid` when invalid and `--field-disabled` when disabled. Options use `--accent` while highlighted and `--highlight` once chosen (`--highlight-focus` both); a drawn checkbox is `--primary` once chosen.",
  props: {
    Listbox: {
      value: "The chosen value (an array with `multiple`), when you control it. Pair it with `onValueChange`.",
      defaultValue: "The value it starts with, when it controls itself.",
      onValueChange: "Called with the new value, or array, when the choice changes.",
      multiple: "Lets people choose several options.",
      indicator: "`none` (the fill only), `check` or `checkbox`.",
      filter: "Shows a field above the list that narrows the options.",
      autoOptionFocus: "Highlights a selected or first option on focus; true by default.",
      selectOnFocus: "Selects when the highlight moves; false by default.",
      focusOnHover: "Moves the highlight under the pointer while focused; true by default.",
      metaKeySelection: "Multiple mode: require Ctrl/Cmd to extend a pointer selection; false by default.",
      header: "Controls above the list, outside its listbox role, such as a select-all checkbox.",
      filterValue: "Controlled query; pair with onFilterValueChange.",
      defaultFilterValue: "Initial uncontrolled query, empty by default.",
      onFilterValueChange: "Called with edits to the query.",
      filterMatch: "`contains` (default), `startsWith`, or a function of option text and query.",
      filterPlaceholder: "The filter field's placeholder.",
      listClassName: "Classes for the scrolling list, such as `max-h-64`.",
      disabled: "Greys the list, keeps its value and takes it out of the tab order.",
      name: "Submits each chosen value as a hidden input of this name; nothing while disabled.",
    },
    ListboxItem: {
      value: "The value this option chooses.",
      textValue: "The text the filter and type-ahead match, when the children are not plain text.",
      disabled: "The option cannot be highlighted or chosen.",
      icon: "Leading media beside both lines.",
      description: "A second, muted line under the label.",
    },
  },
} satisfies ComponentDoc
