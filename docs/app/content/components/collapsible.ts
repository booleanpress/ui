import type { ComponentDoc } from "../types.ts"

export default {
  slug: "collapsible",
  title: "Collapsible",
  category: "Panel",
  purpose: "Shows or hides one region of content from a button.",
  links: {
    radix: { label: "Radix Collapsible", href: "https://www.radix-ui.com/primitives/docs/components/collapsible" },
    apg: { label: "APG Disclosure", href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" },
    spec: "specs/003_moved-components.md#collapsible",
  },
  usage: `\`\`\`tsx
<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">Advanced settings</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>Port 587, STARTTLS</CollapsibleContent>
</Collapsible>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A button shows and hides two extra rows below an always-visible one." },
    { id: "controlled", title: "Controlled", description: "`open` and `onOpenChange` keep the state in your code, so the trigger text can follow it." },
    { id: "disabled", title: "Disabled", description: "A disabled collapsible ignores its trigger." },
  ],
  accessibility: {
    semantics: "The trigger is a `button` with `aria-expanded`, pointing at the content it controls.",
    labels: "Give the trigger a name that stays true when the state changes, such as \"Advanced settings\". An icon-only trigger needs an `aria-label`.",
    focus: "The trigger is a tab stop, and focus stays on it when the content opens or closes.",
    limits: [
      "There is no built-in indicator: draw a chevron or change the label yourself, and do not rely on the icon alone, since the state is in `aria-expanded`.",
      "Closed content is not in the page, so the browser's find-in-page does not see it, and a screen reader cannot reach it.",
    ],
  },
  keyboard: [
    { keys: ["Space"], behaviour: "Opens or closes the content, with the trigger focused." },
    { keys: ["Enter"], behaviour: "Opens or closes the content, with the trigger focused." },
  ],
  props: {
    Collapsible: {
      open: "Whether the content is shown, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with the new state when the trigger is activated.",
      disabled: "Prevents the trigger from changing the state.",
    },
    CollapsibleTrigger: {
      asChild: "Render the child element, usually a `Button`, instead of a bare `button`.",
    },
    CollapsibleContent: {
      forceMount: "Keeps the content in the page while closed. It stays visible: hide it yourself with `data-[state=closed]:hidden`, or animate it.",
      asChild: "Render the child element instead.",
    },
  },
} satisfies ComponentDoc
