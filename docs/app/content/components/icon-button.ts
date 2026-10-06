import type { ComponentDoc } from "../types.ts"

export default {
  slug: "icon-button",
  title: "Icon button",
  category: "Button",
  purpose: "A square button with an icon and no text, which cannot be left without a name.",
  links: {
    radix: { label: "Radix Tooltip", href: "https://www.radix-ui.com/primitives/docs/components/tooltip" },
    apg: { label: "APG Button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
    spec: "specs/004_full-suite-components.md#icon-button",
  },
  usage: `\`\`\`tsx
<IconButton label="Edit mailer" tooltip>
  <PencilIcon />
</IconButton>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Text, outlined and danger icon buttons, each named by `label`." },
    { id: "severities", title: "Severities and variants", description: "Each severity as a solid, outlined and text icon button." },
    { id: "sizes", title: "Sizes", description: "Extra small, small, default and large." },
    { id: "with-tooltip", title: "With tooltip", description: "`tooltip` shows the label on hover and focus." },
    { id: "rounded", title: "Rounded", description: "`rounded` makes a circle; `raised` adds a shadow." },
    { id: "loading", title: "Loading", description: "`loading` replaces the icon with a spinner and ignores presses while the work runs." },
  ],
  accessibility: {
    semantics: "A native `button`, or the element passed with `asChild`.",
    labels:
      "`label` is required and becomes the accessible name; the tooltip repeats it on screen only.",
    focus: "It is in the tab order unless disabled; with `tooltip`, focus opens the tooltip.",
    limits: [
      "A disabled icon button cannot be focused or hovered, so its tooltip cannot open. Say near it why it is disabled.",
      "A loading icon button is `aria-disabled`, not `disabled`: it keeps its focus and tab stop, and refuses presses until the work ends.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "Activates the button." },
    { keys: ["Space"], behaviour: "Activates the button." },
    { keys: ["Escape"], behaviour: "With `tooltip`, closes the tooltip." },
  ],
  props: {
    IconButton: {
      variant: "The emphasis, as Button's: `ghost` by default, or `default`, `outline`, `secondary`, `destructive`, `link`.",
      severity: "The colour of the `default`, `outline`, `ghost` and `link` variants: `success`, `info`, `warning`, `help`, `danger` or `contrast`.",
      rounded: "A circle.",
      raised: "Adds the raised shadow.",
      loading: "Shows the spinner in place of the icon, sets `aria-busy` and `aria-disabled`, and refuses presses; the button keeps its focus.",
      asChild: "Render the child element instead (a link), with the button's look and behaviour merged onto it.",
    },
  },
} satisfies ComponentDoc
