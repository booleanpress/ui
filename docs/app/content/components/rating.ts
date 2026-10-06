import type { ComponentDoc } from "../types.ts"

export default {
  slug: "rating",
  title: "Rating",
  category: "Form",
  purpose: "Lets people give a score out of a row of stars, or shows a score that cannot change.",
  links: {
    radix: { label: "Radix Radio Group", href: "https://www.radix-ui.com/primitives/docs/components/radio-group" },
    apg: { label: "APG Radio Group", href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/" },
    spec: "specs/004_full-suite-components.md#rating",
  },
  usage: `\`\`\`tsx
<Rating defaultValue={3.5} aria-label="Rate this reply" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Five stars with 3.5 chosen; pressing the chosen star again clears it." },
    { id: "whole-stars", title: "Whole stars", description: "`allowHalf={false}` selects only whole numbers." },
    { id: "vertical", title: "Vertical", description: "Halves fill from the top." },
    { id: "templates", title: "Templates", description: "`renderIcon` chooses different content for each position." },
    { id: "emoji", title: "Emoji", description: "The template highlights only the selected position." },
    { id: "half-stars", title: "Half stars", description: "Half stars are on by default, so people can choose 3.5." },
    {
      id: "controlled",
      title: "Controlled",
      description: "`value` and `onValueChange` keep the score in your state, and buttons can set it too.",
    },
    { id: "number-of-stars", title: "Number of stars", description: "`max={10}` draws ten stars." },
    {
      id: "custom-icon",
      title: "Custom icon",
      description: "`icon` and `emptyIcon` draw hearts in place of stars.",
    },
    {
      id: "read-only",
      title: "Read only",
      description: "`readOnly` shows an average of 4.5 that people cannot change.",
    },
    { id: "disabled", title: "Disabled", description: "`disabled` dims the stars and stops them being used." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
  ],
  accessibility: {
    semantics:
      'A `radiogroup` of `radio` buttons, one per star or half star. Read only, it is a single `img` named with the value.',
    labels:
      'Name the group with `aria-label` or `aria-labelledby`. Each star is named by its value, such as "3 of 5".',
    focus:
      "The group is one tab stop: Tab lands on the chosen star, or the first. The arrow keys move along the stars.",
    limits: [
      "Clearing is not part of the radio group pattern: a screen reader hears the star become unchecked, and the `ratingCleared` message, but nothing tells people beforehand that a second press clears. Say so near the rating where it matters.",
      "Stars are 16 px with no gap. For touch use larger custom targets: even `lg` is only 20 px and does not meet the 24 px target-size minimum on its own.",
      "Half stars split a 16 px star into two 8 px targets; they suit a pointer better than a finger.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the chosen star, or to the first star when none is chosen, then out of the rating." },
    { keys: ["→", "↓"], behaviour: "Chooses the next star (half star with `allowHalf`), from the last back to the first; → goes the other way in right-to-left pages." },
    { keys: ["←", "↑"], behaviour: "Chooses the previous star, from the first round to the last; ← goes the other way in right-to-left pages." },
    { keys: ["Space"], behaviour: "Chooses the focused star when it is not chosen yet; on the chosen star, clears the rating to 0 (unless `allowClear={false}`)." },
    { keys: ["Enter"], behaviour: "Chooses the focused star; on the chosen star, clears the rating to 0 (unless `allowClear={false}`)." },
    { keys: ["Backspace", "Delete"], behaviour: "Clears the rating to 0 and announces it (unless `allowClear={false}`)." },
  ],
  theming:
    "All marks use `--primary`; the chosen portion is filled. Hover scales an enabled mark to 110% over `--bui-duration-base`. Focus is a 2px `--primary` outline. A disabled rating is drawn at 50% opacity.",
  props: {
    Rating: {
      value: "The rating, when you control it: 0 (none) to `max`. Pair it with `onValueChange`.",
      defaultValue: "The rating at the start, when it controls itself. 0 by default.",
      onValueChange: "Called with the new rating when a star is chosen, and with 0 when the rating is cleared.",
      max: "The number of stars. 5 by default.",
      allowHalf: "Half-star steps, enabled by default. Set false for whole-star steps.",
      readOnly: "Shows the rating as one named image that cannot change.",
      disabled: "Dims the stars and ignores the pointer and the keyboard.",
      size: "`sm` draws 14 px stars, `default` 16 px, `lg` 20 px. Defaults to the provider's `controlSize`.",
      icon: "The mark of a chosen star, in place of the filled star.",
      renderIcon: "Renders each position with `{ index, active, checked, value }`; index starts at zero and active identifies the filled layer.",
      emptyIcon: "The mark of an unchosen star. Defaults to `icon`, else the outlined star.",
      orientation: "`horizontal` (default) or `vertical`, which stacks the stars.",
      allowClear: "Lets the chosen star, pressed again, or Backspace and Delete clear the rating to 0. `true` by default.",
      name: "The form field name; the rating is submitted with the form.",
      required: "The form cannot be submitted until a star is chosen.",
      "aria-label": "Names the rating, when there is no visible label.",
      "aria-labelledby": "The id of the visible label that names the rating.",
    },
  },
} satisfies ComponentDoc
