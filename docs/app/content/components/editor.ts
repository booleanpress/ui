import type { ComponentDoc } from "../types.ts"

export default {
  slug: "editor",
  title: "Editor",
  category: "Form",
  purpose: "A rich-text field with a formatting toolbar: headings, marks, lists, quotes and links, read and written as HTML.",
  links: {
    apg: { label: "APG Toolbar", href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" },
    spec: "specs/004_full-suite-components.md#editor",
  },
  peers: ["@tiptap/react", "@tiptap/pm", "@tiptap/starter-kit"],
  usage: `\`\`\`tsx
<Editor
  aria-label="Email body"
  value={html}
  onChange={setHtml}
  placeholder="Write the email…"
/>
\`\`\`

The value is HTML: sanitise it on the server before showing it to anyone else.`,
  examples: [
    { id: "basic", title: "Basic", description: "An email template with a heading, marks, a list, a quote and a link." },
    { id: "controlled", title: "Controlled", description: "`value` and `onChange` keep the HTML in state, shown under the editor." },
    { id: "placeholder", title: "Placeholder", description: "`placeholder` shows a hint while the editor is empty." },
    { id: "read-only", title: "Read only", description: "`readOnly` shows content without a toolbar; the text can still be selected and copied." },
    { id: "minimal-toolbar", title: "Minimal toolbar", description: "`toolbar` keeps only the controls you list." },
    {
      id: "character-count",
      title: "Character count with limit",
      description: "`characterCount` with `maxLength` counts characters and refuses more.",
    },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "disabled", title: "Disabled", description: "A disabled editor turns off the text and every control." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "with-form", title: "With a form", description: "`name` submits the HTML with a form, and Reset restores `defaultValue`." },
  ],
  accessibility: {
    semantics:
      "The text is an editable `textbox` and the controls form a `toolbar`; format buttons are toggle buttons with `aria-pressed`.",
    labels:
      "Name the editor with `aria-label` or `aria-labelledby`; the toolbar and its buttons are named by the provider's strings.",
    focus:
      "The toolbar is one tab stop with arrow-key movement, and the next Tab enters the text. The link form takes focus when it opens.",
    limits: [
      "Tiptap renders in the browser after the page loads; on the server the toolbar and an empty text area are drawn, then the content appears.",
      "A paste that would pass `maxLength` is refused whole, not cut to fit.",
      "The counter is read with the field's description when the text is focused; it is not announced on every key.",
      "In a list item that can be indented, Tab indents it and Shift+Tab outdents it instead of leaving the editor; Enter on an empty item leaves the list.",
      "Read-only mode hides the toolbar. Links in read-only text open with a normal click; in editable text they do not, so a click places the caret.",
      "Pressed formats are drawn in the primary colour on a faint plate; the visual target uses the colour alone.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves into the toolbar (one stop), then into the text; Shift+Tab goes back." },
    { keys: ["→", "←"], behaviour: "In the toolbar, moves to the next or previous control, skipping disabled ones. Reversed in a right-to-left page." },
    { keys: ["Home", "End"], behaviour: "In the toolbar, moves to the first or last control." },
    { keys: ["Enter", "Space"], behaviour: "On a format button, turns the format on or off, keeping focus on the button; on the text style, opens its list." },
    { keys: ["Ctrl", "B"], behaviour: "Bold (⌘B on a Mac)." },
    { keys: ["Ctrl", "I"], behaviour: "Italic (⌘I on a Mac)." },
    { keys: ["Ctrl", "U"], behaviour: "Underline (⌘U on a Mac)." },
    { keys: ["Ctrl", "Shift", "S"], behaviour: "Strikethrough (⌘⇧S on a Mac)." },
    { keys: ["Ctrl", "E"], behaviour: "Inline code (⌘E on a Mac)." },
    { keys: ["Ctrl", "Alt", "1–3"], behaviour: "Heading 1, 2 or 3 (⌘⌥1–3 on a Mac)." },
    { keys: ["Ctrl", "Alt", "0"], behaviour: "Back to a paragraph (⌘⌥0 on a Mac)." },
    { keys: ["Ctrl", "Shift", "8"], behaviour: "Bulleted list (⌘⇧8 on a Mac)." },
    { keys: ["Ctrl", "Shift", "7"], behaviour: "Numbered list (⌘⇧7 on a Mac)." },
    { keys: ["Ctrl", "Shift", "B"], behaviour: "Quote (⌘⇧B on a Mac)." },
    { keys: ["Ctrl", "K"], behaviour: "Opens the link form for the selection (⌘K on a Mac)." },
    { keys: ["Ctrl", "Z"], behaviour: "Undo (⌘Z on a Mac)." },
    { keys: ["Ctrl", "Shift", "Z"], behaviour: "Redo; Ctrl+Y as well (⌘⇧Z on a Mac)." },
    { keys: ["Enter"], behaviour: "In the link form, applies the address, or shows why it is refused." },
    { keys: ["Escape"], behaviour: "Closes the link form or the text-style list without a change." },
  ],
  theming:
    "The frame has the field look: `--field` (`--field-filled` when filled, `--field-disabled` when disabled), the `--control` edge, `--control-hover` on hover, `--ring` while the text has focus, `--invalid` when invalid. The toolbar is ruled off with `--border`; its icons are `--muted-foreground`, `--foreground` on hover and `--primary` on `--accent` when pressed. Quotes have a `--control` bar, inline code and code blocks a `--muted` fill, links `--primary`; the placeholder and the counter are `--muted-foreground`.",
  props: {
    Editor: {
      "aria-label": "The text's name. Use it or `aria-labelledby`.",
      "aria-labelledby": "The id of a visible label that names the text.",
      "aria-describedby": "The id of an error message or hint; the counter's id is added when `characterCount` is on.",
      "aria-invalid": "Marks the text invalid: the edge turns `--invalid`.",
      id: "The id of the editable text, for your own `aria-labelledby` or `aria-controls`.",
      className: "Classes for the frame that holds the toolbar and the text.",
    },
  },
} satisfies ComponentDoc
