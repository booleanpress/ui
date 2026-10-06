import type { ComponentDoc } from "../types.ts"

export default {
  slug: "inplace",
  title: "Inplace",
  category: "Form",
  purpose: "Text that turns into a field on click and saves when you press Enter or leave it.",
  links: {
    spec: "specs/004_full-suite-components.md#inplace",
  },
  usage: `\`\`\`tsx
<Inplace label="Mailer name" value={name} onSave={rename} />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Click the name, edit it, and press Enter or the tick to save." },
    { id: "textarea", title: "Textarea", description: "`multiline` edits in a textarea: Enter adds a line, Ctrl+Enter or ⌘+Enter saves." },
    { id: "controlled", title: "Controlled", description: "`value` and `open` are held by the page, and a button outside opens the field." },
    { id: "async-save", title: "Async save with error", description: "`onSave` waits for a request; a refused value keeps the field open with the error." },
    { id: "disabled", title: "Disabled", description: "`disabled` shows the value with no way to edit it." },
    { id: "custom-display", title: "Custom display", description: "`renderDisplay` shows a status badge and `renderEditor` a native select." },
  ],
  accessibility: {
    semantics:
      "Closed, a native `button` named by the value; open, a `group` holding the field and its save and cancel buttons.",
    labels: "`label` is required: it names the field and the \"Edit {label}\" hint. The buttons are named by provider strings.",
    focus:
      "Opening moves focus into the field and selects its text; saving or cancelling returns focus to the value.",
    limits: [
      "An empty value shows the placeholder; give one, or the button has no visible text.",
      "Escape in the field cancels the edit only: inside a dialog, sheet or popover, the outer layer stays open.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "On the value, opens the field." },
    { keys: ["Enter"], behaviour: "In the field, saves and returns focus to the value. In a `multiline` field it makes a new line." },
    { keys: ["Ctrl", "Enter"], behaviour: "In a `multiline` field, saves (⌘+Enter on a Mac)." },
    { keys: ["Escape"], behaviour: "Puts the value back, closes the field and returns focus to the value; a dialog around it stays open. While a save runs, it waits." },
    { keys: ["Tab"], behaviour: "Moves to the ✓ and × buttons; leaving the field and its buttons saves." },
  ],
  props: {
    Inplace: {
      className: "Classes for the wrapper; `w-full` lets the field fill its container.",
    },
  },
  theming:
    "Closed, the value has no edge and takes the `--accent` fill on hover, 6px radius. Open, it is the library's Input or Textarea, with the ✓ (`--success`) and × (`--destructive`) as addons on its `--control` edge.",
} satisfies ComponentDoc
