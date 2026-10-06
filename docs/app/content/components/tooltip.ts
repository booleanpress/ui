import type { ComponentDoc } from "../types.ts"

const AS_CHILD = "Render the child element instead, with this part's behaviour and classes merged onto it."

export default {
  slug: "tooltip",
  title: "Tooltip",
  category: "Overlay",
  purpose: "A short label that appears when the pointer rests on, or keyboard focus reaches, an element.",
  links: {
    radix: { label: "Radix Tooltip", href: "https://www.radix-ui.com/primitives/docs/components/tooltip" },
    apg: { label: "APG Tooltip", href: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/" },
    spec: "specs/002_pilot-mini-specs.md#tooltip",
  },
  usage: `\`\`\`tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Send test email</Button>
  </TooltipTrigger>
  <TooltipContent>Sends to your own address</TooltipContent>
</Tooltip>
\`\`\`

Tooltips need \`BooleanUIProvider\` above them, which supplies the shared tooltip delay.`,
  examples: [
    { id: "basic", title: "Basic", description: "A tooltip on a labelled button." },
    {
      id: "standalone",
      title: "Standalone",
      description: "A tooltip on a status tag; `tabIndex={0}` lets keyboard focus open it too.",
    },
    { id: "arrow", title: "Arrow", description: "The arrow is drawn by default; `arrow={false}` leaves it out." },
    { id: "sides", title: "Sides", description: "`side` places the tooltip on any of the four sides." },
    { id: "offset", title: "Offset", description: "`sideOffset` and `alignOffset` move the tooltip away from or along the trigger." },
    { id: "delay", title: "Delay", description: "`delayDuration` on one `Tooltip` replaces the provider's delay for that tooltip alone." },
    { id: "controlled", title: "Controlled", description: "`open` and `onOpenChange` hand the state to the page; a switch shows and hides the tooltip." },
    { id: "icon-row", title: "Icon row", description: "Sweep the pointer across the row: each tooltip waits briefly, and none flashes." },
    {
      id: "disabled-trigger",
      title: "Disabled trigger",
      description: "A disabled button gets no events, so a focusable wrapper carries the tooltip.",
    },
  ],
  accessibility: {
    semantics: "The content has `role=\"tooltip\"`, and the open trigger gets `aria-describedby` pointing at it.",
    labels: "A tooltip describes; it does not name. An icon-only button still needs its own `aria-label`.",
    focus: "The tooltip is never focusable. It opens at once when the trigger gets keyboard focus and closes when focus leaves.",
    limits: [
      "Touch screens do not open it. Never put the only copy of a fact in a tooltip.",
      "Its content must be plain text: a person cannot move into it.",
      "A tooltip on an element that is not focusable is never shown to keyboard users. `tabIndex={0}` fixes that, at the cost of a tab stop that does nothing else, so use it for a short explanation of a term or a status, not for an action.",
      "A controlled tooltip still closes on Escape and on a press outside it; `onOpenChange` reports it. Prevent the press with `onPointerDownOutside` on `TooltipContent` when the control that opens it sits outside it, as the Controlled example does.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Focusing the trigger opens its tooltip at once; moving focus away closes it." },
    { keys: ["Escape"], behaviour: "Closes the tooltip and leaves focus on the trigger." },
  ],
  props: {
    TooltipProvider: {
      delayDuration: "Milliseconds before a tooltip opens. Defaults to the provider's `tooltipDelay` (500).",
      skipDelayDuration: "Milliseconds after one closes in which the next opens at once. Defaults to the provider's `tooltipSkipDelay` (0).",
    },
    Tooltip: {
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
      delayDuration: "Milliseconds before this tooltip opens, instead of the provider's.",
    },
    TooltipTrigger: { asChild: AS_CHILD },
    TooltipContent: {
      asChild: AS_CHILD,
      side: "The preferred side: `top`, `right`, `bottom` or `left`. `top` by default; it flips when there is no room.",
      align: "Alignment along that side: `start`, `center` or `end`. `center` by default.",
      sideOffset: "Distance in pixels from the trigger. 0 by default.",
      alignOffset: "Shift in pixels along the trigger, from the `start` or `end` alignment. 0 by default.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
    },
  },
  theming: "The tooltip is a dark slate label in both themes: `--foreground` as its fill and `--background` as its text in light, `--secondary-hover` and `--foreground` in dark, with a small arrow in the same fill (`data-slot=\"tooltip-arrow\"`).",
} satisfies ComponentDoc
