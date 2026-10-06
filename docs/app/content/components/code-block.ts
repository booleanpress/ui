import type { ComponentDoc } from "../types.ts"

export default {
  slug: "code-block",
  title: "Code block",
  category: "Misc",
  purpose: "Shows code or a log in a panel, with a copy button, line numbers and highlighting you bring.",
  links: {
    spec: "specs/004_full-suite-components.md#code-block",
  },
  usage: `\`\`\`tsx
<CodeBlock title="mailer.ts" code={source} language="ts" lineNumbers />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Plain text with the copy button in the corner." },
    { id: "with-title", title: "With title", description: "`title` adds a file-name bar above the code." },
    { id: "line-numbers", title: "Line numbers", description: "`lineNumbers` adds a gutter that is not selected or copied." },
    { id: "highlighted-lines", title: "Highlighted lines", description: "`highlightLines={[3, 4]}` marks those lines." },
    { id: "long", title: "Long (scrolls)", description: "`maxHeight` makes the code scroll; `wrapToggle` adds a button that wraps long lines." },
    { id: "inline", title: "Inline", description: "`InlineCode` from Typography is for code inside a sentence." },
    { id: "pre-highlighted", title: "Pre-highlighted HTML", description: "`html` takes a highlighter's output, which is inserted uncleaned, so pass only trusted or sanitised HTML." },
  ],
  accessibility: {
    semantics:
      "A `figure` holding a scrollable `region` of code. Line numbers are hidden from assistive technology.",
    labels:
      "The code area is named from the title, else the language; pass `aria-label` to name it yourself. The wrap toggle reports its state with `aria-pressed`.",
    focus:
      "The buttons come first in the tab order, then the code area, so a keyboard can scroll it with the arrow keys.",
    limits: [
      "Highlighted lines are marked by colour only; a screen reader does not hear which lines they are. Say it in the text around the panel.",
      "Colours from `html` are your highlighter's: check their contrast on `--card` in both themes.",
      "`html` is inserted as HTML without cleaning: pass a highlighter's output or HTML you have sanitised, never raw HTML built from what a person typed.",
      "Without a title the buttons sit over the code's top right-hand corner, on a right-to-left page too, as the code reads left to right; a first line that runs under them scrolls into view.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the wrap toggle and the copy button, then to the code area, where the arrow keys scroll it." },
    { keys: ["Enter", "Space"], behaviour: "On the wrap toggle, wraps or unwraps long lines; on the copy button, copies the code." },
  ],
  theming:
    "The panel is `--card` with the border token and an 8 px radius; line numbers are `--muted-foreground`, highlighted lines `--accent`. Code uses `font-mono`: set `--font-mono` in your theme for another typeface.",
} satisfies ComponentDoc
