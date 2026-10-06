import type { ComponentDoc } from "../types.ts"

export default {
  slug: "choice-card",
  title: "Choice card",
  category: "Form",
  purpose: "Options drawn as cards with a title and a description, chosen one at a time or several at once.",
  links: {
    radix: { label: "Radix Radio Group", href: "https://www.radix-ui.com/primitives/docs/components/radio-group" },
    apg: { label: "APG Radio Group", href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/" },
    spec: "specs/004_full-suite-components.md#choice-card",
  },
  usage: `\`\`\`tsx
<ChoiceCardGroup type="single" defaultValue="pro" aria-label="Plan">
  <ChoiceCard value="starter" title="Starter" description="For one site sending its own receipts." />
  <ChoiceCard value="pro" title="Pro" description="For teams sending from several sites." />
</ChoiceCardGroup>
\`\`\``,
  examples: [
    {
      id: "single",
      title: "Single",
      description: "Plans as radio cards, each with a badge, a price and a description.",
    },
    { id: "multiple", title: "Multiple", description: "`type=\"multiple\"` makes checkbox cards, so several can be chosen." },
    { id: "with-icons", title: "With icons", description: "An icon before each title." },
    { id: "disabled", title: "Disabled option", description: "One card is disabled and cannot be chosen." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error edge on every card, with the message linked by `aria-describedby`." },
  ],
  accessibility: {
    semantics:
      'A single choice is a `radiogroup` of `radio` buttons; a multiple choice is a `group` of `checkbox` buttons. The whole card is the label, so a click anywhere on it chooses it.',
    labels:
      "Name the group with `aria-label` or `aria-labelledby`. Each control is named by its card's title and described by its description; the icon is hidden from screen readers.",
    focus:
      "Radio cards are one tab stop, on the chosen card; checkbox cards are a tab stop each. The card shows the focus outline.",
    limits: [
      "Keep links and buttons out of a card: the whole card is a label, and a control inside it would compete with the card's own.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the chosen radio card (or the first), or to the next checkbox card." },
    { keys: ["↓", "→"], behaviour: "Single: chooses the next card, from the last back to the first (→ goes the other way in right-to-left pages)." },
    { keys: ["↑", "←"], behaviour: "Single: chooses the previous card, from the first round to the last." },
    { keys: ["Space"], behaviour: "Chooses the focused radio card, or toggles the focused checkbox card." },
  ],
  theming:
    "A card has no fill of its own, so it takes the page colour: a 1px `--border` edge and an 8px radius (6px for checkbox cards), `--accent` under the pointer and a `--primary` edge when chosen; `aria-invalid` makes the edge `--invalid`. The title is `--foreground`, the description `--muted-foreground`.",
  props: {
    ChoiceCardGroup: {
      type: "`single` (radios, a string value) or `multiple` (checkboxes, an array value).",
      value: "The chosen value (a string, or an array with `multiple`), when you control it.",
      defaultValue: "The chosen value at the start, when it controls itself.",
      onValueChange: "Called with the new value.",
      disabled: "Disables every card.",
      size: "The controls' size: `sm`, `default` or `lg`. Defaults to the provider's `controlSize`.",
      variant: "`filled` fills the unchosen controls grey. Defaults to the provider's `fieldVariant`.",
      name: "The form field name; the chosen value (each chosen value, with `multiple`) is submitted under it.",
      required: "With `single`, the form cannot be submitted until a card is chosen.",
      "aria-invalid": "Draws every card's edge in `--invalid` and marks the controls invalid.",
    },
    ChoiceCard: {
      value: "The value the group holds while this card is chosen.",
      title: "The card's name; it names the control.",
      description: "A line or two under the title, read as the control's description.",
      icon: "A decorative icon before the title.",
      aside: "Short text at the end of the title row, such as a price.",
      disabled: "Disables this card only.",
      indicator: "Where the control sits: `end` for radios, `start` for checkboxes by default.",
    },
  },
} satisfies ComponentDoc
