import type { ComponentDoc } from "../types.ts"

export default {
  slug: "scroll-top",
  title: "Scroll top",
  category: "Misc",
  purpose: "A round button that appears once the page, or a box, has scrolled down, and takes it back to the top.",
  links: {
    spec: "specs/004_full-suite-components.md#scroll-top",
  },
  usage: `\`\`\`tsx
<main>
  {/* a long list */}
  <ScrollTop />
</main>
\`\`\``,
  examples: [
    {
      id: "window",
      title: "Window",
      description: "Scrolling the page shows the button in the corner.",
      frameHeight: 360,
    },
    { id: "element", title: "Element", description: "`target=\"parent\"` puts the button in a scrolling box." },
    { id: "custom-icon", title: "Custom icon", description: "`icon` and a secondary `variant` change how the button looks." },
  ],
  accessibility: {
    semantics: "A native `button`, shown only while the target is scrolled down.",
    labels: "Named by the provider's `scrollToTop` string; pass `aria-label` to name it yourself.",
    focus:
      "The button is a tab stop where it sits in the source, so put it last. After it is pressed, focus moves to the top of what scrolled.",
    limits: [
      "The button covers whatever is under the corner; leave room there, or set its place with `className`.",
      "A scrolling box should be focusable (`tabIndex={0}`, with a `role` and a name) so it can be scrolled from the keyboard; the button does not replace that.",
    ],
  },
  keyboard: [{ keys: ["Enter", "Space"], behaviour: "Scrolls the target back to the top." }],
  props: {
    ScrollTop: {
      target: "`window` (default): the page, the button fixed in the window's corner; `parent`: the scrolling box it is placed in.",
      threshold: "How far, in px, the target must scroll down before the button appears. 400 by default.",
      behavior: "`smooth` (default) or `auto`. Reduced motion always jumps.",
      icon: "Replaces the chevron.",
      variant: "Button's look; `default` (the primary fill) by default.",
      severity: "Button's severity colour.",
    },
  },
  theming:
    "A 48 px `--primary` circle with a 24 px icon, 20 px from the bottom and end edges. It fades in at the overlay entrance duration and out at the exit duration, as the theme's motion sets.",
} satisfies ComponentDoc
