import type { ComponentDoc } from "../types.ts"

export default {
  slug: "accordion",
  title: "Accordion",
  category: "Panel",
  purpose: "A stack of headings, each showing or hiding its own panel of content.",
  links: {
    radix: { label: "Radix Accordion", href: "https://www.radix-ui.com/primitives/docs/components/accordion" },
    apg: { label: "APG Accordion", href: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" },
    spec: "specs/004_full-suite-components.md#accordion",
  },
  usage: `\`\`\`tsx
<Accordion type="single" collapsible>
  <AccordionItem value="log">
    <AccordionTrigger>What does the delivery log record?</AccordionTrigger>
    <AccordionContent>Every email the site sends, kept for 30 days.</AccordionContent>
  </AccordionItem>
</Accordion>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "One panel open at a time; `collapsible` lets the open one close." },
    { id: "multiple", title: "Multiple", description: "`type=\"multiple\"` keeps several panels open, here with the first open from the start." },
    { id: "controlled", title: "Controlled", description: "Buttons outside the accordion open and close its panels." },
    { id: "custom-indicator", title: "Custom indicator", description: "A plus that becomes a minus replaces the chevron." },
    { id: "template", title: "With content template", description: "An icon and a badge beside each title, inside a bordered box." },
    { id: "disabled", title: "Disabled", description: "`disabled` on the accordion disables every panel; on one item, only that one." },
  ],
  accessibility: {
    semantics:
      "Each header is an `h3` holding a `button` with `aria-expanded`; each panel is a `region` named by its trigger.",
    labels:
      "Each trigger is named by its text. Keep the text the same when the panel opens; the state is announced for you.",
    focus:
      "Every trigger is a tab stop, in order, and a panel's own controls follow its trigger.",
    limits: [
      "Closed panels are removed from the page, so find-in-page and screen readers do not see their content.",
      "The heading level is fixed at `h3`. On a page whose outline needs another level, place the accordion where an `h3` belongs.",
      "The indicator is decoration (`aria-hidden`); the state is in `aria-expanded`.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "Opens or closes the panel of the focused trigger." },
    { keys: ["Tab"], behaviour: "Moves to the next trigger, or into the open panel's controls." },
    { keys: ["↓"], behaviour: "Moves to the next trigger, wrapping at the end." },
    { keys: ["↑"], behaviour: "Moves to the previous trigger, wrapping at the start." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last trigger." },
  ],
  props: {
    Accordion: {
      type: "`single` opens one panel at a time; `multiple` lets several stay open. Required.",
      value: "The open panel's value (`single`) or values (`multiple`), when you control it. Pair it with `onValueChange`.",
      defaultValue: "The panel or panels open at the start, when it controls itself.",
      onValueChange: "Called with the new value or values when a panel opens or closes.",
      collapsible: "With `type=\"single\"`, whether the open panel can be closed. `false` by default.",
      disabled: "Disables every panel.",
      dir: "The reading direction. The provider's `dir` by default.",
      orientation: "`vertical` (default) or `horizontal`: which arrow keys move between triggers.",
    },
    AccordionItem: {
      value: "The value that names this panel. Required.",
      disabled: "Disables this panel: it keeps its state and ignores its trigger.",
    },
    AccordionTrigger: {
      asChild: "Render the child element instead, with the trigger's behaviour and classes merged onto it.",
    },
    AccordionContent: {
      forceMount: "Keeps the content in the page while closed, still showing; hide it yourself. `className` reaches the box inside the animated one, so `in-data-[state=closed]:hidden` there hides it once the panel closes.",
    },
  },
  theming:
    "Headers and panels sit on `--card`. A closed header is `--muted-foreground`, an open or hovered one `--foreground`; the rule between panels is `--border`; focus is `--ring`. A disabled panel is drawn at 60% opacity.",
} satisfies ComponentDoc
