import type { ComponentDoc } from "../types.ts"

export default {
  slug: "avatar",
  title: "Avatar",
  category: "Misc",
  purpose: "Shows a person or an organisation as a round picture, or as their initials when there is no picture.",
  links: {
    radix: { label: "Radix Avatar", href: "https://www.radix-ui.com/primitives/docs/components/avatar" },
    spec: "specs/003_moved-components.md#avatar",
  },
  usage: `\`\`\`tsx
<Avatar>
  <AvatarImage src="/people/ada.png" alt="Ada Lovelace" />
  <AvatarFallback>AL</AvatarFallback>
</Avatar>
\`\`\``,
  examples: [
    { id: "image", title: "Image", description: "A picture, with initials as the fallback." },
    { id: "fallback", title: "Fallback", description: "Initials show when there is no image or it fails to load." },
    { id: "sizes", title: "Sizes", description: "`sm`, the default and `lg`." },
    { id: "with-badge", title: "With a badge", description: "A presence dot at the bottom corner." },
    { id: "group", title: "Group", description: "Overlapping avatars with a count chip." },
  ],
  accessibility: {
    semantics:
      "The image is an `img` once it has loaded; until then, or if it fails, the fallback text shows.",
    labels:
      "Give `AvatarImage` an `alt` with the person's name, or `alt=\"\"` when the name is written beside it. Give a badge and a count chip visually hidden text.",
    focus: "An avatar takes no focus. Wrap it in a link or a button when it is interactive.",
    limits: [
      "The picture is not cropped by the component: `aspect-square` and the round mask do it, so a non-square image is cut.",
      "In a small size the badge is a plain dot (its icon is hidden at `sm`), so meaning cannot be in the icon.",
    ],
  },
  keyboard: [],
  theming: "The fallback is `--secondary-hover` with `--foreground` text; the badge is `--primary`, and the edge that separates avatars in a group is `--card`. Pass a `className` on the badge to use another token, as the badge example does with `bg-success`.",
  props: {
    Avatar: {
      size: "`sm` 24 px, `default` 28 px or `lg` 42 px. Also set as `data-size`, which the badge and the group read.",
    },
    AvatarImage: {
      src: "The picture's address. With none, the fallback shows.",
      alt: "The picture's text alternative: the person's name, or an empty string when a name sits beside it.",
      onLoadingStatusChange: "Called with `loading`, `loaded` or `error` as the image's state changes.",
    },
    AvatarFallback: {
      delayMs: "Wait this many milliseconds before showing the fallback, so a fast image never flashes it.",
    },
  },
} satisfies ComponentDoc
