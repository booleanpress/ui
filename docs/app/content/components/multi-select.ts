import type { ComponentDoc } from "../types.ts"

export default {
  slug: "multi-select",
  title: "Multi-select",
  category: "Form",
  purpose: "A select-like field whose list lets people choose several options; the field shows them as labels, chips or a count.",
  links: {
    apg: {
      label: "APG Combobox (select-only)",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/",
    },
    spec: "specs/004_full-suite-components.md#multi-select",
  },
  peers: ["@base-ui/react"],
  usage: `\`\`\`tsx
<MultiSelect items={events} defaultValue={["Bounced"]}>
  <MultiSelectTrigger className="w-full">
    <MultiSelectValue placeholder="Choose events" />
  </MultiSelectTrigger>
  <MultiSelectContent>
    <MultiSelectList>
      {(event: string) => (
        <MultiSelectItem key={event} value={event}>
          {event}
        </MultiSelectItem>
      )}
    </MultiSelectList>
  </MultiSelectContent>
</MultiSelect>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "The chosen labels are joined with commas, and chosen options show a check." },
    { id: "chips", title: "Chips", description: "Each choice becomes a chip with a button to remove it." },
    { id: "checkbox", title: "Checkbox selection", description: "A checkbox on every option, and one at the top that chooses or clears them all." },
    { id: "filter", title: "Filter", description: "A filter field is shown from the start, with a message when nothing matches." },
    { id: "groups", title: "Groups", description: "Options in labelled groups." },
    { id: "max-shown", title: "Max shown", description: "Long choices are cut short with \"+2 more\", or shown as a count." },
    { id: "clear", title: "Clear", description: "`clearable` adds a button that empties the choice." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "fluid", title: "Fluid", description: "`fluid` makes the field as wide as its container." },
    { id: "disabled", title: "Disabled", description: "A disabled field keeps its choice and does not open." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "in-dialog", title: "In a dialog", description: "The list opens inside the dialog, and Escape closes it before the dialog." },
  ],
  accessibility: {
    semantics:
      'The trigger is a `combobox` button that opens a list with a filter field and a `listbox` of options; chosen options are marked selected.',
    labels:
      "Name the trigger with a `Label` or `aria-label`; the list takes the same name.",
    focus:
      "The trigger is one tab stop. Opening moves focus into the list, and closing returns it to the trigger.",
    limits: [
      "A chip's × is a pointer shortcut and not in the tab order; with the keyboard, unpick the option in the list or press Backspace on the closed field to remove the last one. Its 22 px circle takes presses over a 24 px square, the minimum target of WCAG 2.5.8.",
      "Inside a dialog or sheet the list is clipped by the overlay's box and flips above the field when there is more room there.",
      "Select all chooses the options the filter leaves, not those hidden by it.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "ArrowDown"], behaviour: "On the trigger, opens the list with focus in its filter." },
    { keys: ["ArrowDown", "ArrowUp"], behaviour: "In the list, highlight the next or the previous option." },
    { keys: ["Enter"], behaviour: "In the list, chooses or unpicks the highlighted option; the list stays open." },
    { keys: ["Space"], behaviour: "In the list, with nothing typed, chooses or unpicks the highlighted option." },
    { keys: ["A–Z"], behaviour: "In the list, typing filters the options and shows the filter field." },
    { keys: ["Escape"], behaviour: "Closes the list and returns focus to the trigger; inside a dialog, the dialog stays open." },
    { keys: ["Backspace"], behaviour: "On the closed trigger, removes the last chosen option." },
    { keys: ["Tab"], behaviour: "With `clearable` and options chosen, moves from the trigger to the clear button." },
  ],
  theming:
    "The trigger takes Select's tokens: `--field` (`--field-filled` filled), `--control` for the edge, `--ring` on focus and while open, `--invalid` when invalid. Chips use `--secondary` (`--secondary-hover` under the ×). The list uses `--popover`, `--accent` for the highlighted option and `--highlight` for chosen ones (`--highlight-focus` while highlighted); a drawn checkbox is `--primary` once chosen. Its motion is set once in `theme.css`.",
  props: {
    MultiSelect: {
      items: "The options: a flat array, or groups of `{ value, items }`.",
      value: "The chosen options, when you control them. Pair it with `onValueChange`.",
      defaultValue: "The options chosen at first, when it controls itself.",
      onValueChange: "Called with the new array whenever the choice changes.",
      itemToStringLabel: "Turns an option into the label the field shows. `{ value, label }` objects need none.",
      isItemEqualToValue: "Compares an option with a chosen value; by default the same value, or the same `value` field.",
      disabled: "Stops the field from opening or changing.",
      open: "Whether the list is open, when you control it. Pair it with `onOpenChange`.",
      onOpenChange: "Called when the list opens or closes.",
      name: "The field name, for the values the form submits.",
    },
    MultiSelectTrigger: {
      size: "`sm` is 26 px high, `default` 34 px, `lg` 42 px. Defaults to the provider's `controlSize`.",
      variant: "`default` is the white field; `filled` the grey `--field-filled` one. Defaults to the provider's `fieldVariant`.",
      fluid: "Makes the field as wide as its container.",
      clearable: "Shows a clear button inside the field while options are chosen.",
    },
    MultiSelectValue: {
      placeholder: "Shown, in the muted colour, while nothing is chosen.",
      display: "`labels` joins the labels with commas, `chips` shows a removable chip for each, `count` says \"3 selected\".",
      maxShown: "Shows this many labels or chips, then \"+{count} more\".",
    },
    MultiSelectContent: {
      filter: "Shows the filter field from the start.",
      filterPlaceholder: "The filter field's placeholder.",
      selectAll: "Shows a checkbox that chooses, or clears, every option the filter leaves.",
      side: "Which side of the field the list prefers. It flips when there is no room.",
      align: "How the list lines up with the field: `start`, `center` or `end`.",
    },
    MultiSelectItem: {
      value: "The option this item chooses.",
      indicator: "`check` (the default) or `checkbox`, drawn at the option's start.",
      icon: "Leading media beside both lines.",
      description: "A second, muted line under the label.",
      disabled: "The option cannot be highlighted or chosen.",
    },
  },
} satisfies ComponentDoc
