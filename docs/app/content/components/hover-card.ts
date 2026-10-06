import type { ComponentDoc } from "../types.ts"

export default {
  slug: "hover-card",
  title: "Hover card",
  category: "Overlay",
  purpose: "A preview of what a link points to, such as a person or a record, shown while the pointer rests on it.",
  links: {
    radix: { label: "Radix Hover Card", href: "https://www.radix-ui.com/primitives/docs/components/hover-card" },
    spec: "specs/004_full-suite-components.md#hover-card",
  },
  usage: `\`\`\`tsx
<HoverCard>
  <HoverCardTrigger href="/team/maya">Maya Okafor</HoverCardTrigger>
  <HoverCardContent>Support lead, billing queue.</HoverCardContent>
</HoverCard>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A person's name previews their profile on hover or focus." },
    { id: "placement", title: "Placement", description: "`side` puts the card above, after, below or before its trigger." },
    { id: "delay", title: "Delay", description: "`openDelay` and `closeDelay` set how long the card waits to open and to close." },
  ],
  accessibility: {
    semantics:
      "The trigger keeps its own role, a link by default. The card has no role and is not announced, so its content must also be reachable through the link.",
    labels: "The trigger is named by its text; the card needs no name.",
    focus:
      "Focus stays on the trigger while the card is open, and Escape closes it.",
    limits: [
      "Touch screens have no hover: a tap follows the link. Where the browser also gives the trigger focus on a tap (Chrome on Android), the card opens as focus does, but a touch user never relies on it.",
      "Do not put buttons, links or form controls in the card: keyboard and screen-reader users cannot reach them.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Focusing the trigger opens the card after `openDelay`; moving focus away closes it." },
    { keys: ["Escape"], behaviour: "Closes the card; focus stays on the trigger." },
  ],
  props: {
    HoverCard: {
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
      openDelay: "Milliseconds the pointer rests on the trigger before the card opens. 700 by default.",
      closeDelay: "Milliseconds after the pointer leaves before the card closes. 300 by default.",
    },
    HoverCardTrigger: {
      asChild: "Render the child element instead of a link, with the trigger's behaviour merged onto it.",
    },
    HoverCardContent: {
      side: "The preferred side: `top`, `right`, `bottom` or `left`. `bottom` by default; it flips when there is no room.",
      align: "Alignment along that side: `start`, `center` or `end`. `center` by default.",
      sideOffset: "Distance in pixels from the trigger. 4 by default.",
      forceMount: "Keep the card in the page while closed. Hiding it is then yours to do.",
    },
  },
  theming:
    "The card is a floating surface, as the popover: `--popover` and `--popover-foreground`, a `--border` edge, an 8px radius and a soft shadow. The theme's overlay motion opens and closes it.",
} satisfies ComponentDoc
