import type { ComponentDoc } from "../types.ts"

export default {
  slug: "input",
  title: "Input",
  category: "Form",
  purpose: "A single-line text box, for text, numbers, addresses and files.",
  links: {
    spec: "specs/002_pilot-mini-specs.md#input-label-field-separator-skeleton",
  },
  usage: `\`\`\`tsx
<Input id="sender-email" type="email" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A labelled email input with a placeholder." },
    { id: "clear", title: "Clear", description: "`clearable` shows a × while there is a value; it empties the input and keeps focus." },
    {
      id: "with-icon",
      title: "With icon",
      description: "An icon goes in through `InputGroup` with an `InputGroupAddon` at the start or end.",
    },
    { id: "file", title: "File", description: "`type=\"file\"` styles the file button to match the text." },
    {
      id: "key-filter",
      title: "Key filter",
      description: "Each `keyFilter` preset refuses the characters it does not take, typed or pasted.",
    },
    {
      id: "key-filter-regex",
      title: "Key filter regex",
      description: "A regular expression tests each character, or the whole value when written `^…$`.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled and read-only", description: "A read-only input can be focused and copied; a disabled one cannot and is not submitted." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
  ],
  accessibility: {
    semantics: "A native `input`; `type=\"text\"` is a `textbox` and other types keep their own roles.",
    labels: "Name every input with a `Label` or `aria-label`; a placeholder is not a name. Put hints and errors in `aria-describedby`.",
    focus: "It is in the tab order unless disabled; the clear button follows it while it shows.",
    limits: [
      "`aria-invalid` only changes the look and the announcement. Validation and the message are yours.",
      "The clear button shows only while there is a value, and not on a disabled or read-only input.",
      "A character `keyFilter` refuses is not announced: say what the field takes in its label or a hint.",
      "`keyFilter` cannot stop text composed with an input method editor, or put in by autofill.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves from a clearable input with a value to its clear button." },
    { keys: ["Enter", "Space"], behaviour: "On the clear button: empties the input and moves the focus back to it." },
    { keys: ["A–Z", "0–9"], behaviour: "With `keyFilter`: types the character only when the filter takes it." },
    { keys: ["Ctrl", "V"], behaviour: "With `keyFilter`: pastes the text only when the filter takes all of it." },
  ],
  theming:
    "The fill is `--field` (`--field-filled` when filled) and the border `--control`, `--control-hover` under the pointer and `--ring` on focus; invalid draws the border in `--invalid` and the placeholder in `--destructive-strong`; disabled fills `--field-disabled` with `--field-disabled-foreground` text. The clear × is `--control-hover`, `--foreground` under the pointer.",
  props: {
    Input: {
      size: "`sm` (26 px), `default` (34 px) or `lg` (42 px). Defaults to the provider's `controlSize`.",
      variant: "`default` (the white `--field` fill) or `filled` (the grey `--field-filled` fill). Defaults to the provider's `fieldVariant`.",
      clearable: "Shows a × button at the end while the input has a value.",
      keyFilter: "Lets only some characters in: `int`, `num`, `money`, `hex`, `alpha`, `alphanum`, or a regular expression tested per character (or on the whole value when written `^…$`).",
    },
  },
} satisfies ComponentDoc
