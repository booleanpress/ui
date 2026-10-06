import type { ComponentDoc } from "../types.ts"

export default {
  slug: "empty",
  title: "Empty",
  category: "Misc",
  purpose: "Fills the space of a list, table or page that has nothing to show yet, and says what to do next.",
  links: {
    spec: "specs/003_moved-components.md#empty",
  },
  usage: `\`\`\`tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <MailIcon />
    </EmptyMedia>
    <EmptyTitle>No emails yet</EmptyTitle>
    <EmptyDescription>Emails appear here as soon as your site sends one.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Send a test email</Button>
  </EmptyContent>
</Empty>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "An icon tile, a title, a description and one action." },
    { id: "bordered", title: "Bordered", description: "`className=\"border\"` draws a dashed frame around two actions." },
    { id: "no-results", title: "No results", description: "A bare icon and a way back out of a search that found nothing." },
  ],
  accessibility: {
    semantics: "Plain `div`s with no roles; the title and description are not headings, so the page's heading levels are untouched.",
    labels: "The text is the content. Use the heading level your page needs if the empty state is the main content of a section.",
    focus: "Not focusable; the buttons inside it are in the tab order.",
    limits: [
      "An empty state that replaces a list after a search or filter is not announced. Announce the result count in a live region the page owns.",
      "`EmptyTitle` and `EmptyDescription` are `div`s (stock), so a screen reader's heading navigation skips them.",
    ],
  },
  keyboard: [],
  theming: "The icon tile is `--secondary` with a `--secondary-foreground` icon, the title `--foreground` and the description `--muted-foreground`. The dashed border takes its colour from `--border` when you add `border`.",
  props: {
    EmptyMedia: {
      variant: "`default` for a bare icon or picture, `icon` for an icon in a 40 px rounded tile.",
    },
  },
} satisfies ComponentDoc
