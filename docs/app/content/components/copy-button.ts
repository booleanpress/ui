import type { ComponentDoc } from "../types.ts"

export default {
  slug: "copy-button",
  title: "Copy button",
  category: "Button",
  purpose: "Copies a value to the clipboard and confirms it with a check and \"Copied\".",
  links: {
    radix: { label: "Radix Tooltip", href: "https://www.radix-ui.com/primitives/docs/components/tooltip" },
    apg: { label: "APG Button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
    spec: "specs/004_full-suite-components.md#copy-button",
  },
  usage: `\`\`\`tsx
<CopyButton value={apiKey} label="Copy API key" />
\`\`\``,
  examples: [
    { id: "icon-only", title: "Icon only", description: "An icon button beside a message ID, with a tooltip that says \"Copied\" afterwards." },
    { id: "with-label", title: "With label", description: "`showLabel` shows a text label that changes to \"Copied\"." },
    { id: "in-input-group", title: "In an input group", description: "A small copy button at the end of a read-only API key field." },
    { id: "custom-timeout", title: "Custom timeout", description: "`timeout` sets how long \"Copied\" shows, and `getValue` supplies the text when clicked." },
    { id: "disabled", title: "Disabled", description: "A disabled button cannot be pressed." },
    { id: "copy-fails", title: "Copy fails", description: "When copying fails, the button shows a cross and \"Copy failed\", and `onCopyError` is called." },
  ],
  accessibility: {
    semantics:
      "A native `button`, plus a hidden status region that announces \"Copied\" or \"Copy failed\".",
    labels:
      "The icon button is named by `label`, and its name does not change after copying. With `showLabel`, the visible text is the name.",
    focus:
      "Focus stays on the button through the copy, inside a dialog too. The tooltip opens on hover and keyboard focus.",
    limits: [
      "The Clipboard API needs a secure page (HTTPS or localhost); the fallback depends on the browser still supporting the copy command.",
      "Screen readers announce \"Copied\" once per copy; two presses within the timeout are announced once.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "Copies the value." },
    { keys: ["Space"], behaviour: "Copies the value." },
    { keys: ["Escape"], behaviour: "Closes the tooltip, \"Copied\" included." },
  ],
  props: {
    CopyButton: {
      variant: "The emphasis, as Button's: `ghost` for the icon button, `outline` with the label, by default.",
      severity: "The colour of the `default`, `outline`, `ghost` and `link` variants, as Button's.",
      rounded: "A circle (a pill with the label).",
    },
  },
} satisfies ComponentDoc
