import type { ComponentDoc } from "../types.ts"

export default {
  slug: "search-field",
  title: "Search field",
  category: "Form",
  purpose: "A search box with a search icon, a clear button and an optional spinner, inside a search landmark.",
  links: {
    apg: { label: "APG Search landmark", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/search.html" },
    spec: "specs/004_full-suite-components.md#search-field",
  },
  usage: `\`\`\`tsx
<SearchField
  aria-label="Search delivery logs"
  placeholder="Search delivery logs"
  onSearch={onSearch}
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A named search box with a placeholder." },
    {
      id: "results-count",
      title: "With results count",
      description: "The list filters as people type, and a status line says how many match.",
    },
    {
      id: "loading",
      title: "Loading",
      description: "`loading` shows a spinner while results load.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "The text shows; the field and its clear button cannot be used." },
  ],
  accessibility: {
    semantics:
      'A `search` landmark round a native search input. The clear button is a native `button`, and the spinner is a `status`.',
    labels:
      "Name it with `aria-label` or a `Label`. With more than one search on a page, give each its own name.",
    focus: "The input is a tab stop, then the clear button while it shows. Clearing keeps focus in the input.",
    limits: [
      "Inside a dialog, the dialog's own Escape handling runs first and closes it.",
      "A results count is the app's to show; put it in a `role=\"status\"` element so it is announced.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "Runs the search: calls `onSearch` with the text. It never submits a form round the field." },
    { keys: ["Escape"], behaviour: "Empties the field and keeps the focus in it; on an empty field, leaves the field." },
    { keys: ["Tab"], behaviour: "Moves from the input to the clear button while it shows." },
  ],
  theming:
    "The field is `InputGroup`'s: `--field`, `--control`, `--ring`, `--invalid` and `--field-disabled`. The search icon and the clear × are `--control-hover`; the spinner is `--muted-foreground`.",
  props: {
    SearchField: {
      onSearch: "Called with the text when the search is submitted with Enter.",
      loading: "Shows a spinner at the end and sets `aria-busy` on the input.",
      size: "`sm` (28 px), `default` (35 px) or `lg` (42 px). Defaults to the provider's `controlSize`.",
      variant: "`default` (the white `--field` fill) or `filled` (the grey `--field-filled` fill). Defaults to the provider's `fieldVariant`.",
    },
  },
} satisfies ComponentDoc
