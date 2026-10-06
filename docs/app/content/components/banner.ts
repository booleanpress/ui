import type { ComponentDoc } from "../types.ts"

export default {
  slug: "banner",
  title: "Banner",
  category: "Messages",
  purpose: "A message across the full width of the page, about the page or the whole product, with optional actions and a dismiss button.",
  links: {
    spec: "specs/004_full-suite-components.md#banner",
  },
  usage: `\`\`\`tsx
<Banner tone="warning" dismissible>
  <BannerTitle>Your licence expires in 5 days</BannerTitle>
  <BannerDescription>Renew it to keep receiving updates.</BannerDescription>
  <BannerActions>
    <Button size="sm">Renew licence</Button>
  </BannerActions>
</Banner>
\`\`\``,
  examples: [
    { id: "tones", title: "Tones", description: "Neutral, info, success, warning and destructive, each with its own icon." },
    { id: "with-actions", title: "With actions", description: "Buttons at the end of the text." },
    { id: "dismissible", title: "Dismissible", description: "`dismissible` adds a close button; focus then moves to the button that shows the banner again." },
    { id: "sticky", title: "Sticky", description: "`position=\"sticky\"` keeps the banner at the top while the content scrolls." },
  ],
  accessibility: {
    semantics:
      'A `role="status"` for neutral, info and success, and `role="alert"` for warning and destructive, so a banner added later is announced.',
    labels:
      "Say the whole message in the text; the colour and icon only repeat it.",
    focus:
      "The banner takes no focus; its actions and close button are in the tab order. When dismissing it, focus moves to `returnFocusTo` or the next element.",
    limits: [
      "A banner present when the page loads is not announced; screen-reader users find it in reading order. Put it first.",
      "Show one banner at a time per area; several in a row compete for attention.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "On the ×, removes the banner and moves focus on." },
    { keys: ["Tab"], behaviour: "Moves through the banner's actions and its ×, in reading order." },
  ],
  props: {
    Banner: {
      tone: "`neutral`, `info` (default), `success`, `warning` or `destructive`: the colours, the default icon and the live role.",
      position: "`static` (default) or `sticky`: sticks to the top of the scrolling box.",
      role: "The live role. `status` for the calm tones and `alert` for warning and destructive by default.",
    },
  },
  theming:
    "Each tone is the Message colours: `--{tone}-subtle` fill, `--{tone}-border` edge and `--{tone}-strong` text; `neutral` uses `--secondary`, `--secondary-foreground` and `--border`.",
} satisfies ComponentDoc
