import type { ComponentDoc } from "../types.ts"

export default {
  slug: "spinner",
  title: "Spinner",
  category: "Misc",
  purpose: "A turning icon that shows that something is working and the wait has no known length.",
  links: {
    spec: "specs/002_pilot-mini-specs.md#spinner",
  },
  usage: `\`\`\`tsx
<Button disabled>
  <Spinner />
  Sending
</Button>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "The default spinner." },
    { id: "sizes", title: "Sizes", description: "A `size-*` class sets the size, and the colour follows the text." },
    { id: "in-button", title: "In a button", description: "A spinner before the label of a disabled button." },
    { id: "inline", title: "Inline", description: "A spinner beside a line of status text." },
  ],
  accessibility: {
    semantics: 'An `svg` with `role="status"` and the name "Loading", so it is a polite live region.',
    labels: "Named \"Loading\" by default; pass `aria-label` to say more, such as \"Sending the test email\".",
    focus: "A spinner takes no focus.",
    limits: [
      "A `role=\"status\"` that is already on the page when it loads is not announced. Add the spinner when the wait starts, or put the message in a live region that exists already.",
      "The turn is `animate-spin`. `theme.css` ends it under `prefers-reduced-motion`, so the icon then stands still: keep a text beside it that says the wait is on.",
    ],
  },
  keyboard: [],
  props: {
    Spinner: {
      "aria-label": "The accessible name. It defaults to the provider's `loading` string.",
    },
  },
} satisfies ComponentDoc
