import type { ComponentDoc } from "../types.ts"

export default {
  slug: "chip",
  title: "Chip",
  category: "Misc",
  purpose: "A compact, rounded label for a value someone chose, such as a tag, a recipient or a filter, which they may remove.",
  links: {
    spec: "specs/004_full-suite-components.md#chip",
  },
  usage: `\`\`\`tsx
<ChipGroup aria-label="Recipients">
  {list.map((address) => (
    <Chip key={address} label={address} onRemove={() => remove(address)} />
  ))}
</ChipGroup>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A row of labels." },
    { id: "icon", title: "Icon", description: "An icon before the label." },
    { id: "image", title: "Image", description: "A round picture before the label." },
    { id: "removable", title: "Removable", description: "`onRemove` adds a remove button; Backspace and Delete remove the chip too." },
    { id: "group", title: "Group", description: "Chips in a named list; removing one moves focus to the next." },
    { id: "disabled", title: "Disabled", description: "A disabled chip cannot be removed, beside one that still can." },
  ],
  accessibility: {
    semantics:
      "In a `ChipGroup` (`role=\"list\"`) each chip is a `listitem`, and the remove button is a native `button`. The icon and image are decorative unless you give `imageAlt`.",
    labels: "The remove button is named \"Remove\" plus the chip's label, for example \"Remove billing@example.com\".",
    focus:
      "A chip without a remove button is not focusable; a removable chip's remove button is its tab stop. After a removal, focus moves to the next chip, else the previous one, else the group.",
    limits: [
      "The chip calls `onRemove` and moves focus at once; it does not wait for your list to change. If you ask before removing, move focus yourself.",
      "A disabled chip's remove button leaves the tab order, and focus skips it after a removal.",
      "Outside a `ChipGroup` focus can only move to a neighbouring chip in the same parent; when the last removable chip there goes, focus has nowhere to land. Put removable chips in a `ChipGroup`.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the next removable chip's remove button." },
    { keys: ["Enter"], behaviour: "On the remove button: removes the chip and moves focus to the next chip, or the previous one." },
    { keys: ["Space"], behaviour: "On the remove button: removes the chip and moves focus to the next chip, or the previous one." },
    { keys: ["Backspace"], behaviour: "On the remove button: removes the chip and moves focus to the next chip, or the previous one." },
    { keys: ["Delete"], behaviour: "On the remove button: removes the chip and moves focus to the next chip, or the previous one." },
  ],
  theming:
    "A chip fills with `--secondary` (`--secondary-hover` while its remove button has focus) and draws its text and icons in `--accent-foreground`.",
} satisfies ComponentDoc
