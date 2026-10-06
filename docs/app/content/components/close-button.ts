import type { ComponentDoc } from "../types.ts"

export default {
  slug: "close-button",
  title: "Close button",
  category: "Button",
  purpose: "The round × that dismisses a panel, a card or a notice, named \"Close\" from the provider.",
  links: {
    apg: { label: "APG Button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
    spec: "specs/004_full-suite-components.md#close-button",
  },
  usage: `\`\`\`tsx
<section className="relative rounded-xl border p-4 pe-14">
  DKIM is not set up.
  <CloseButton className="absolute end-3 top-3" onClick={onDismiss} />
</section>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A round × named \"Close\"." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "in-a-card", title: "In a card corner", description: "Dismisses a notice; `label` names what it closes." },
    { id: "disabled", title: "Disabled", description: "A disabled button cannot be activated." },
  ],
  accessibility: {
    semantics: "A native `button`; the × icon is hidden from assistive technology.",
    labels: "Named \"Close\" by default; pass `label` for a clearer name.",
    focus:
      "It is in the tab order. When it removes its panel, move focus somewhere sensible, such as the element that opened the panel.",
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "Activates the button." },
    { keys: ["Space"], behaviour: "Activates the button." },
  ],
} satisfies ComponentDoc
