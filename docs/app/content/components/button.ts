import type { ComponentDoc } from "../types.ts"

export default {
  slug: "button",
  title: "Button",
  category: "Button",
  purpose: "Starts an action, such as saving a form or opening a dialog.",
  links: {
    radix: { label: "Radix Slot", href: "https://www.radix-ui.com/primitives/docs/utilities/slot" },
    apg: { label: "APG Button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
    spec: "specs/002_pilot-mini-specs.md#button",
  },
  usage: `\`\`\`tsx
<div className="flex gap-2">
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</div>
\`\`\``,
  examples: [
    { id: "variants", title: "Variants", description: "Each emphasis, from the main action to a link." },
    { id: "with-icon", title: "With an icon", description: "An icon before the text; an icon-only button needs `aria-label`." },
    { id: "loading", title: "Loading", description: "`loading` shows a spinner and ignores presses, so the button keeps its width and focus." },
    { id: "as-link", title: "As a link", description: "`asChild` puts the button's look on a link." },
    { id: "severities", title: "Severities", description: "`severity` colours a solid button." },
    { id: "raised", title: "Raised", description: "`raised` lifts each severity on a soft shadow." },
    { id: "rounded", title: "Rounded", description: "`rounded` makes each severity a pill." },
    { id: "text-severities", title: "Text severities", description: "The `ghost` variant with a severity." },
    { id: "raised-text", title: "Raised text", description: "A raised `ghost` button: shadow without a fill." },
    { id: "outlined-severities", title: "Outlined severities", description: "The `outline` variant with a severity." },
    { id: "icon-only", title: "Icon only", description: "Square and round icon buttons in every look and size." },
    { id: "with-badge", title: "With a badge", description: "A count inside a button, and a dot on an icon button's corner." },
    { id: "sizes", title: "Sizes", description: "Every size, with and without text." },
    { id: "disabled", title: "Disabled", description: "A disabled button ignores clicks and leaves the tab order." },
  ],
  accessibility: {
    semantics: "A native `button`, or the element you pass with `asChild`.",
    labels: "Its text is its name. An icon-only button needs `aria-label`, and a tooltip with the same words helps sighted users.",
    focus: "It is in the tab order unless it is disabled. The focus ring shows on keyboard focus, not on click.",
    limits: [
      "A disabled button cannot be focused, so a tooltip on it cannot open. Say why it is disabled next to it.",
      "A loading button is `aria-disabled`, not `disabled`: it keeps its focus and its tab stop, and refuses clicks, Enter, Space and its form's submission. The spinner's \"Loading\" joins its name; a label the spinner covers is invisible but still read.",
      "A link passed with `asChild` cannot be `disabled`. A disabled one gets `aria-disabled`, leaves the tab order and is dimmed; a loading one gets the spinner, `aria-busy` and `aria-disabled`. Both refuse the click (`preventDefault`), so a router's link that checks `defaultPrevented`, as the common ones do, does not navigate.",
      "Colour alone does not say what a severity means: the label must say it (\"Delete\", not a red \"OK\"). The visual target's success, info, warning, help and danger colours fall below 4.5:1 as text on white and behind white text in the light theme; `tests/contrast.test.js` lists them.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "Activates the button." },
    { keys: ["Space"], behaviour: "Activates the button." },
  ],
  theming: `Each severity has a token family. Solid: \`--success\`, \`--info-solid\`, \`--warning-solid\`, \`--help\`, \`--destructive\` and \`--contrast\`, each with \`-hover\`, \`-active\` and \`-foreground\` (success reuses \`--success-foreground\`). Outlined and text buttons take the fill colour as their text, with \`-edge\` for the outline and \`-ghost-hover\` and \`-ghost-active\` for the backgrounds. \`--info-solid\` and \`--warning-solid\` are the sky and orange of the visual target; \`--info\` and \`--warning\` stay the blue and yellow of alerts.`,
  props: {
    Button: {
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
      variant: "The emphasis: `default` for the main action, `destructive` for removing something, `outline`, `secondary`, `ghost` or `link` for the rest.",
      size: "The height: `xs` 24 px, `sm` 28 px, `default` 35 px, `lg` 42 px; the `icon` sizes are square (24, 28, 36 and 42 px), for a button with an icon and no text.",
      severity: "The colour of the `default`, `outline`, `ghost` and `link` variants: `success`, `info`, `warning`, `help`, `danger` or `contrast`. `secondary` and `destructive` keep their own colours. Set as `data-severity`.",
      raised: "Adds the raised shadow. In a `ButtonGroup`, the group carries the shadow instead.",
      rounded: "A pill; a circle for an `icon` size. In a `ButtonGroup`, only the outer ends are round.",
    },
  },
} satisfies ComponentDoc
