import type { ComponentDoc } from "../types.ts"

export default {
  slug: "input-mask",
  title: "Input mask",
  category: "Form",
  purpose: "A text field that keeps a pattern, such as a phone number or a date, and fills its slots as people type.",
  links: {
    spec: "specs/004_full-suite-components.md#input-mask",
  },
  usage: `\`\`\`tsx
<InputMask id="support-phone" type="tel" mask="(999) 999-9999" placeholder="(999) 999-9999" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A phone number: the brackets, space and dash are typed for you." },
    { id: "patterns", title: "Patterns", description: "A date, a licence key mixing letters and digits, and a tax number." },
    { id: "optional", title: "Optional part", description: "Everything after `?` is optional, so the number is complete without the extension." },
    { id: "slot-character", title: "Slot character", description: "`slotChar=\"mm/dd/yyyy\"` shows what each empty slot is for." },
    { id: "unmask", title: "Unmasked value", description: "With `unmask`, `onValueChange` reports the typed characters only." },
    {
      id: "auto-clear",
      title: "Auto-clear",
      description: "An unfinished number is cleared on blur; `autoClear={false}` keeps it.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "disabled", title: "Disabled", description: "A disabled field shows its masked value and cannot be changed or submitted." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
  ],
  accessibility: {
    semantics: "A native `input`, with `inputmode=\"numeric\"` when every slot takes a digit.",
    labels:
      "Name it with a `Label` or `aria-label`; say the format in the label or a hint, as a placeholder is not a name.",
    focus: "One tab stop; focusing an unfinished value puts the caret at its first empty slot.",
    limits: [
      "Undo and redo (⌘Z, ⇧⌘Z, the Edit menu) do nothing in a masked field: the mask rewrites the text on every keystroke, so the browser's history would put back half-masked text.",
      "A refused character is not announced: say the format in the label or a hint.",
      "The fixed characters and empty slots are part of the text, so a screen reader reads them as it reads any text.",
      "Text composed with an input method editor is read once it is committed.",
      "A slot letter is A–Z; `a` refuses accented letters.",
    ],
  },
  keyboard: [
    { keys: ["0–9", "A–Z"], behaviour: "Fills the next slot when the character fits it, skipping the fixed characters; otherwise it is refused." },
    { keys: ["Backspace"], behaviour: "Removes the character before the caret; the characters after it move back." },
    { keys: ["Delete"], behaviour: "Removes the character after the caret; the characters after it move back." },
    { keys: ["Ctrl", "V"], behaviour: "Pastes text as if typed: the fixed characters and anything that fits no slot are dropped." },
  ],
  theming: "The field is `Input`'s: `--field`, `--control`, `--ring`, `--invalid` and `--field-disabled`.",
  props: {
    InputMask: {
      mask: "The pattern: `9` a digit, `a` a letter, `*` a letter or a digit, `?` starts the optional part; anything else is fixed.",
      slotChar: "What an empty slot shows: one character for every slot (`_`), or a string as long as the pattern (`mm/dd/yyyy`).",
      autoClear: "Empties the field when it loses focus with the required part unfinished. On by default.",
      unmask: "`value`, `defaultValue` and `onValueChange` carry the typed characters only, without the mask.",
      value: "The value, when you control it: as the field shows it, or the typed characters with `unmask`.",
      defaultValue: "The value it starts with, in the same form as `value`.",
      onValueChange: "Called with the new value and `{ complete }` on every change.",
      size: "`sm` (28 px), `default` (35 px) or `lg` (42 px). Defaults to the provider's `controlSize`.",
      variant: "`default` (the white `--field` fill) or `filled` (the grey `--field-filled` fill). Defaults to the provider's `fieldVariant`.",
    },
  },
} satisfies ComponentDoc
