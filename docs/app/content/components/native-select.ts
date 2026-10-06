import type { ComponentDoc } from "../types.ts"

export default {
  slug: "native-select",
  title: "Native select",
  category: "Form",
  purpose: "A styled browser select, for short lists where the platform's own picker is best.",
  links: {
    apg: { label: "APG Combobox, select-only", href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/" },
    spec: "specs/003_moved-components.md#native-select",
  },
  usage: `\`\`\`tsx
<Label htmlFor="encryption">Encryption</Label>
<NativeSelect id="encryption" defaultValue="tls">
  <NativeSelectOption value="none">None</NativeSelectOption>
  <NativeSelectOption value="tls">TLS</NativeSelectOption>
</NativeSelect>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A labelled select with three options." },
    { id: "groups", title: "Groups", description: "Options in labelled groups, with a disabled first option as the prompt." },
    { id: "fluid", title: "Fluid", description: "`fluid` makes the select as wide as its container." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "A disabled select keeps its value and is skipped by Tab." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
  ],
  accessibility: {
    semantics: "A native `select` with `option` and `optgroup`, submitted and validated with its form.",
    labels: "Name every select with a `Label` or `aria-label`. Put errors in `aria-describedby`.",
    focus: "It is in the tab order unless disabled.",
    limits: [
      "The open list is drawn by the browser and the operating system, so its look cannot be themed beyond `Canvas` colours.",
      "It is styled as a one-line field: `size` sets its height, not the native row count, and `multiple` is not styled. For several choices, use a checkbox group.",
    ],
  },
  keyboard: [
    { keys: ["Arrow Down", "Arrow Up"], behaviour: "Changes the chosen option, or moves through the list when it is open. The browser decides which." },
    { keys: ["Alt", "Arrow Down"], behaviour: "Opens the list, where the browser supports it." },
    { keys: ["Letters"], behaviour: "Jump to the next option that starts with the typed text." },
  ],
  props: {
    NativeSelect: {
      size: "`sm` is 28 px high, `default` 35 px, `lg` 42 px. Defaults to the provider's `controlSize`.",
      variant: "`default` is the white field; `filled` the grey `--field-filled` one. Defaults to the provider's `fieldVariant`.",
      fluid: "Makes the select as wide as its container.",
    },
  },
} satisfies ComponentDoc
