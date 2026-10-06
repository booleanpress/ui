import type { ComponentDoc } from "../types.ts"

export default {
  slug: "tags-input",
  title: "Tags input",
  category: "Form",
  purpose: "A text field that turns what people type into removable tags, such as labels, addresses or domains.",
  links: {
    spec: "specs/004_full-suite-components.md#tags-input",
  },
  peers: ["@base-ui/react"],
  usage: `\`\`\`tsx
<TagsInput
  id="labels"
  defaultValue={["billing"]}
  delimiter=","
  placeholder="Add a label"
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Enter adds the typed text as a tag, and Backspace in the empty input removes the last one." },
    { id: "delimiter", title: "Delimiter", description: "A comma ends a tag as well as Enter, and a pasted list is split into tags." },
    { id: "no-duplicates", title: "No duplicates", description: "A tag already in the field is not added again unless `allowDuplicates` is set." },
    { id: "max", title: "Max", description: "Once `max` tags are in, the input stops taking text." },
    { id: "custom-tag", title: "Custom tag", description: "`tagIcon` as a function gives each tag its own icon." },
    { id: "typeahead", title: "Typeahead", description: "`suggestions` lists values as you type; Enter still adds your own text." },
    { id: "sizes", title: "Sizes", description: "Small, default and large, with the tags sized to match." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "A disabled field keeps its tags but takes no input and has no remove buttons." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "read-only", title: "Read-only", description: "`readOnly` shows the tags without remove buttons; they are still submitted." },
  ],
  accessibility: {
    semantics: "The tags are a `list` of `listitem` chips before a text input, which becomes a `combobox` when it has suggestions. Each chip has a remove `button`.",
    labels: "Name the input with a `Label`, `aria-label` or `aria-labelledby`. Remove buttons read \"Remove {label}\".",
    focus: "Each remove button is a tab stop before the input. Removing a tag moves focus to a neighbouring tag, or back to the input.",
    limits: [
      "Adding a tag is not announced; the new chip appears in the list before the input.",
      "A refused tag (a duplicate, or over `max`) stays in the input as typed.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "Adds the typed text as a tag; with a suggestion highlighted, adds that suggestion." },
    { keys: [","], behaviour: "With `delimiter=\",\"`, adds the typed text as a tag." },
    { keys: ["Backspace"], behaviour: "In the empty input, removes the last tag. On a remove button, removes its tag." },
    { keys: ["Delete"], behaviour: "On a remove button, removes its tag." },
    { keys: ["Shift", "Tab"], behaviour: "From the input, moves to the last tag's remove button." },
    { keys: ["ArrowDown", "ArrowUp"], behaviour: "With `suggestions`, highlight the next or the previous suggestion." },
    { keys: ["Escape"], behaviour: "With `suggestions`, closes the list; inside a dialog, the dialog stays open." },
  ],
  theming:
    "The field takes Input's tokens: `--field` (`--field-filled` filled), `--control` for the edge (`--control-hover` under the pointer), `--ring` while the input has focus, `--invalid` when invalid, `--field-disabled` when disabled. Tags are the library's `Chip` on `--secondary`. Suggestions use `--popover` and `--accent`, with the motion set once in `theme.css`.",
  props: {
    TagsInput: {
      value: "The tags, when you control them. Pair it with `onValueChange`.",
      defaultValue: "The tags it starts with, when it controls itself.",
      onValueChange: "Called with the new tags whenever one is added or removed.",
      delimiter: "Characters that end a tag as they are typed or pasted, besides Enter, such as `\",\"`.",
      allowDuplicates: "Lets the same tag be added more than once.",
      max: "The most tags the field takes.",
      suggestions: "Values offered as people type; picking one adds it.",
      tagIcon: "An icon before each label, or a function of the tag that returns one.",
      size: "`sm` is 28 px high, `default` 35 px, `lg` 42 px. Defaults to the provider's `controlSize`.",
      variant: "`default` is the white field; `filled` the grey `--field-filled` one. Defaults to the provider's `fieldVariant`.",
      disabled: "Disables the input and leaves out the remove buttons; the tags stay at full contrast.",
      readOnly: "Shows the tags without remove buttons and takes no typing; the tags are still submitted.",
      name: "Submits each tag as a hidden input of this name; nothing while disabled.",
      required: "Asks for at least one tag before the form submits.",
    },
  },
} satisfies ComponentDoc
