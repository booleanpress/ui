import type { ComponentDoc } from "../types.ts"

export default {
  slug: "aspect-ratio",
  title: "Aspect ratio",
  category: "Media",
  purpose: "Keeps its content at a fixed width-to-height ratio as the width changes, such as a 16:9 image or video.",
  links: {
    radix: { label: "Radix Aspect Ratio", href: "https://www.radix-ui.com/primitives/docs/components/aspect-ratio" },
    spec: "specs/004_full-suite-components.md#aspect-ratio",
  },
  usage: `\`\`\`tsx
<AspectRatio ratio={16 / 9}>
  <img src="/screenshots/dashboard.png" alt="The delivery dashboard" className="size-full object-cover" />
</AspectRatio>
\`\`\``,
  examples: [
    { id: "image", title: "16:9 image", description: "A screenshot cropped to 16:9 in a rounded box." },
    { id: "square", title: "Square", description: "`ratio={1}` gives three square tiles in a grid." },
    { id: "video", title: "Video placeholder", description: "A 16:9 placeholder with a play button for a video." },
  ],
  accessibility: {
    semantics: "Plain elements with no role; they only hold the shape.",
    labels: "The content carries its own name: an image's `alt`, a video's title, a button's label.",
    focus: "Nothing to focus; the content's own controls are in the tab order.",
    limits: ["Content taller than the ratio allows is cut off or overflows; the box does not grow."],
  },
  keyboard: [],
  props: {
    AspectRatio: {
      ratio: "The width divided by the height. 1 by default.",
      asChild: "Render the child element as the inner box instead of a `div`.",
    },
  },
} satisfies ComponentDoc
