import type { ComponentDoc } from "../types.ts"

export default {
  slug: "textarea",
  title: "Textarea",
  category: "Form",
  purpose: "A multi-line text box with optional automatic resizing.",
  links: {
    spec: "specs/003_moved-components.md#textarea",
  },
  usage: `\`\`\`tsx
<div className="flex flex-col gap-2">
  <Label htmlFor="signature">Email signature</Label>
  <Textarea id="signature" />
</div>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A labelled textarea with a placeholder." },
    { id: "fluid", title: "Fluid", description: "`fluid` fills the container width." },
    { id: "grows", title: "Grows with its text", description: "`autoResize` grows and shrinks the box with its text." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "A disabled textarea cannot be focused or edited." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "read-only", title: "Read-only", description: "`readOnly` keeps the text focusable and selectable but stops edits." },
  ],
  accessibility: {
    semantics: "A native `textarea` with the `textbox` role, multi-line.",
    labels: "Name every textarea with a `Label` or `aria-label`; a placeholder is not a name. Put hints and errors in `aria-describedby`.",
    focus: "It is in the tab order unless disabled. Tab moves on and does not insert a tab character.",
    limits: [],
  },
  keyboard: [],
  props: {
    Textarea: {
      autoResize: "Grows and shrinks with its content. False by default; uses native fixed rows otherwise.",
      fluid: "Fills the container width. False by default.",
      size: "`sm` (12 px text), `default` (14 px) or `lg` (16 px). Defaults to the provider's `controlSize`.",
      variant: "`default` (the white `--field` fill) or `filled` (the grey `--field-filled` fill). Defaults to the provider's `fieldVariant`.",
    },
  },
} satisfies ComponentDoc
