import type { ComponentDoc } from "../types.ts"

export default {
  slug: "password-input",
  title: "Password input",
  category: "Form",
  purpose: "A secret field, such as an API key or an SMTP password, with optional visibility controls and strength feedback.",
  links: {
    spec: "specs/003_moved-components.md#password-input",
  },
  usage: `\`\`\`tsx
<Label htmlFor="api-key">API key</Label>
<PasswordInput id="api-key" showToggle />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A masked value without a visibility button." },
    { id: "toggle-mask", title: "Toggle mask", description: "`showToggle` adds an eye button that shows or hides the value." },
    { id: "custom-score", title: "Custom score", description: "Your own scoring policy supplies the label and the percentage." },
    { id: "clear", title: "Clear", description: "`clearable` adds a button that empties the field." },
    {
      id: "rules",
      title: "Rules",
      description: "A checklist under the field ticks each requirement as the value meets it.",
    },
    {
      id: "strength",
      title: "Strength",
      description: "A meter shows how strong the value is, with the level as a tag.",
    },
    {
      id: "rules-popover",
      title: "Rules in a popover",
      description: "`feedback=\"popover\"` shows the meter and checklist in a panel while the field has focus.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "disabled", title: "Disabled", description: "Neither the input nor the show/hide button can be used." },
  ],
  accessibility: {
    semantics: "A native password `input` and a toggle `button` named \"Show password\", with `aria-pressed` while the value is shown. The checklist and meter are read out, and changes are announced politely.",
    labels: "Name the input with a `Label` or `aria-label`. The button's name comes from the provider, so a translation sets it once.",
    focus: "The button is in the tab order after the input, so a keyboard user can reveal the value.",
    limits: [
      "Unmet inline requirements use 70% text opacity. On the default white surface the resulting #707a88 is 4.34:1, below the 4.5:1 text threshold; this visual default is an explicit contrast limitation.",
      "A password input has no `textbox` role, so find it by its label, not by role.",
      "The strength score is a guide built from length and kinds of character; it does not know common or leaked passwords. Pass `scoreStrength` to use a stronger check.",
      "The rules and the meter are not validation: they do not set `aria-invalid` or stop the form.",
    ],
  },
  keyboard: [
    {
      keys: ["Enter", "Space"],
      behaviour: "On the show/hide button: switches between showing and hiding the value. On the clear button: empties the field and moves the focus back to it.",
    },
    {
      keys: ["Escape"],
      behaviour: "With `feedback=\"popover\"`: hides the panel and keeps the focus in the field; the next change shows it again.",
    },
  ],
  props: {
    PasswordInput: {
      showToggle: "Adds the visibility button; false by default.",
      mask: "Controls whether the value is hidden; pair with onMaskChange.",
      defaultMask: "Initial hidden state for an uncontrolled field; true by default.",
      onMaskChange: "Requests the next hidden state when the eye is activated.",
      size: "`sm` (26 px), `default` (34 px) or `lg` (42 px). Defaults to the provider's `controlSize`.",
      variant: "`default` (the white `--field` fill) or `filled` (the grey `--field-filled` fill). Defaults to the provider's `fieldVariant`.",
      clearable: "Shows a × button before the eye while the field has a value.",
      rules: "Requirements, each `{ label, test, weight? }`, shown as a checklist that ticks as the value meets them.",
      strength: "`true` uses four levels; `rules` scores the supplied requirements by weight with five levels.",
      scoreStrength: "Replaces the built-in strength score: a function from the value to a strength level, `{ level, percent }` or `null`. Percentages are clamped to 0–100.",
      feedback: "`inline` puts the meter and the checklist under the field; `popover` in a panel below it while it has focus.",
    },
  },
} satisfies ComponentDoc
