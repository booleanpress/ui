import type { ComponentDoc } from "../types.ts"

export default {
  slug: "input-otp",
  title: "Input OTP",
  category: "Form",
  purpose: "A one-time code entered one character per box; a pasted code fills every box.",
  links: {
    spec: "specs/004_full-suite-components.md#input-otp",
  },
  peers: ["@base-ui/react"],
  usage: `\`\`\`tsx
<InputOTP id="code" maxLength={4}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Four boxes under a label; the first box takes the label's name." },
    {
      id: "controlled",
      title: "Controlled",
      description: "`value` and `onValueChange` hold the code in state; Reset empties it.",
    },
    { id: "mask", title: "Mask", description: "`mask` hides each character as it is typed." },
    {
      id: "integer-only",
      title: "Integer only",
      description: "`validationType=\"numeric\"` refuses letters and opens the number pad on phones.",
    },
    {
      id: "alphanumeric",
      title: "Letters and digits",
      description: "`validationType=\"alphanumeric\"` takes letters too; `normalizeValue` writes them in capitals.",
    },
    {
      id: "separator",
      title: "With separator",
      description: "`InputOTPSeparator` splits the code into two groups that are still one value.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "`disabled` greys every box and takes the field out of the tab order." },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
    {
      id: "sample",
      title: "Sample",
      description: "A \"Verify your email\" card with a resend link and a button that waits for the whole code.",
    },
  ],
  accessibility: {
    semantics:
      "A `group` holds one native `input` per character, and the first has `autocomplete=\"one-time-code\"` so phones can offer a texted code.",
    labels:
      "Name the field with a `Label` whose `htmlFor` is the `InputOTP`'s `id`, or `aria-label`; the other boxes are named by position.",
    focus:
      "The field is one tab stop: Tab enters at the first empty box and the next Tab leaves.",
    limits: [
      "There is no fake caret: each box is a real input with the browser's own caret.",
      "Each box is 36 × 34 px at the default size, 28 × 26 px small: both meet WCAG 2.5.8's 24 px.",
    ],
  },
  keyboard: [
    { keys: ["Characters"], behaviour: "Fills the focused box and moves to the next one; `validationType` limits accepted characters when set." },
    { keys: ["Backspace"], behaviour: "Empties the focused box, or the previous one when it is empty, and moves back." },
    { keys: ["Delete"], behaviour: "Removes the focused box's character; the ones after it move back." },
    { keys: ["ArrowLeft"], behaviour: "Moves to the previous box (the next one in right-to-left)." },
    { keys: ["ArrowRight"], behaviour: "Moves to the next box (the previous one in right-to-left)." },
    { keys: ["Home"], behaviour: "Moves to the first box." },
    { keys: ["End"], behaviour: "Moves to the box after the last character." },
    { keys: ["Ctrl", "V"], behaviour: "Pastes a code across the boxes from the focused one; spaces and refused characters are dropped." },
    { keys: ["Tab"], behaviour: "Leaves the field; the boxes are one tab stop." },
  ],
  theming:
    "Each box is a field: `--field` for the fill (`--field-filled` with `variant=\"filled\"`), `--control` for the edge (`--control-hover` under the pointer), `--ring` for focus, `--invalid` for the error edge, and `--field-disabled` with `--field-disabled-foreground` when disabled. The separator is `--muted-foreground`.",
  props: {
    InputOTP: {
      maxLength: "The number of characters, one box each.",
      size: "`sm` boxes are 28 × 26 px, `default` 36 × 34 px, `lg` 42 × 42 px. Defaults to the provider's `controlSize`.",
      variant: "`default` is the white field; `filled` the grey `--field-filled` one. Defaults to the provider's `fieldVariant`.",
      validationType: "`none` (the default) accepts general characters; `numeric` takes digits only and opens the number pad; `alphanumeric` letters and digits, `alpha` letters only.",
      inputMode: "The keyboard phones open: `numeric` by default with digits, the full keyboard otherwise.",
      value: "The code, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The code it starts with, when it controls itself.",
      onValueChange: "Called with the new code, and the event's details, on every change.",
      onValueComplete: "Called with the code once every box is filled.",
      onValueInvalid: "Called with the text that was refused, when typing or pasting contained characters `validationType` does not take.",
      normalizeValue: "Changes what is typed before it is checked, for example to upper case.",
      mask: "Hides the characters, as a password field does.",
      disabled: "Greys every box and takes the field out of the tab order.",
      readOnly: "Shows the code but does not let it change.",
      required: "The form cannot be submitted until every box is filled.",
      name: "The field name, for the code the form submits.",
      autoSubmit: "Submits the form as soon as every box is filled.",
      autoComplete: "`one-time-code` by default, so phones offer the code from a text message.",
      id: "The first box's `id`, for a `Label`'s `htmlFor`. The others take `id-2`, `id-3` and so on.",
    },
    InputOTPSlot: {
      index: "The box's position, from 0. It names the box: \"Character 2 of 6\".",
    },
  },
} satisfies ComponentDoc
