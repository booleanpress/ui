import type { ComponentDoc } from "../types.ts"

export default {
  slug: "loading-overlay",
  title: "Loading overlay",
  category: "Misc",
  purpose: "Covers a region, or the whole window, with a mask and a spinner while it is busy, and blocks it until it is done.",
  links: {
    spec: "specs/004_full-suite-components.md#loading-overlay",
  },
  usage: `\`\`\`tsx
<LoadingOverlay loading={saving} label="Saving the mailer…" className="rounded-xl">
  <Card>…</Card>
</LoadingOverlay>
\`\`\``,
  examples: [
    { id: "region", title: "Region", description: "Saving blocks the card, and focus returns to the button when it ends." },
    { id: "full-screen", title: "Full screen", description: "`fullScreen` covers the whole window while an import runs." },
    { id: "with-text", title: "With text", description: "A `label` beside the spinner, announced when loading starts." },
    { id: "custom-indicator", title: "Custom indicator", description: "A progress circle in place of the spinner." },
  ],
  accessibility: {
    semantics:
      'While `loading`, the wrapper is `aria-busy="true"` and its content is inert. A `role="status"` region announces the label when loading starts.',
    labels: "Write the label as what is happening (\"Saving the mailer…\").",
    focus:
      "Focus inside the region returns to where it was when loading ends. With `fullScreen`, the rest of the page is inert.",
    limits: [
      "It does not time out: end `loading` yourself, also when the work fails.",
      "A region keeps its size and place; the mask covers exactly the wrapper.",
      "With `fullScreen`, what is on the page when loading starts is made inert; an element added to `<body>` later (a dialog opened from code) is not.",
      "When two full-screen overlays overlap, focus goes back to where it was only if the first one to start is the last to end.",
    ],
  },
  keyboard: [],
  props: {
    LoadingOverlay: {
      className: "Classes for the wrapper; give it the region's radius so the mask's corners match.",
    },
  },
  theming:
    "The mask is the `--mask` token (40 % black, 60 % in dark) with the region's corners; the spinner sits on a small `--popover` card with the overlay shadow. It fades in and out with the overlay motion tokens.",
} satisfies ComponentDoc
