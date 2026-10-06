import type { ComponentDoc } from "../types.ts"

export default {
  slug: "skeleton",
  title: "Skeleton",
  category: "Misc",
  purpose: "A grey pulsing placeholder that holds the shape of content that is still loading.",
  links: {
    spec: "specs/002_pilot-mini-specs.md#input-label-field-separator-skeleton",
  },
  usage: `\`\`\`tsx
<div aria-busy="true" className="flex flex-col gap-2">
  <p role="status" className="sr-only">Loading the email log</p>
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-2/3" />
</div>
\`\`\``,
  examples: [
    { id: "lines", title: "Lines", description: "Three text lines of different widths." },
    { id: "profile", title: "Profile", description: "A round placeholder for an avatar beside two lines." },
    { id: "table-rows", title: "Table rows", description: "Table rows, with a button that swaps to the loaded content." },
  ],
  accessibility: {
    semantics: "A `div` with no role, so it is invisible to assistive technology.",
    labels:
      'Say that something is loading yourself: add a visually hidden `status` message and `aria-busy` on the region being filled.',
    focus: "A skeleton takes no focus.",
    limits: [
      "The sweep is an animation on the block's `::after`, from the inline start, every 1.2 s. `theme.css` stops it under `prefers-reduced-motion`, and the grey block stays.",
      "A skeleton alone tells a screen-reader user nothing. Never ship it without the status text.",
    ],
  },
  keyboard: [],
  theming: "The fill is `--border` (`--foreground` at 6 % in dark); the sweep is `--background` at 40 % (`--foreground` at 4 % in dark).",
} satisfies ComponentDoc
