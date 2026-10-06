import type { ComponentDoc } from "../types.ts"

export default {
  slug: "page-header",
  title: "Page header",
  category: "Panel",
  purpose: "The top of a page: breadcrumb, title, description, meta and actions that fold into a menu when there is no room.",
  links: {
    spec: "specs/004_full-suite-components.md#page-header",
  },
  usage: `\`\`\`tsx
<PageHeader>
  <PageHeaderHeading>
    <PageHeaderTitle>Mailers</PageHeaderTitle>
  </PageHeaderHeading>
  <PageHeaderDescription>The connections your sites send email through.</PageHeaderDescription>
  <PageHeaderActions>
    <PageHeaderAction onSelect={() => {}}>Export</PageHeaderAction>
    <PageHeaderAction pinned onSelect={() => {}}>Add mailer</PageHeaderAction>
  </PageHeaderActions>
</PageHeader>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A title and a description." },
    { id: "with-breadcrumb", title: "With breadcrumb", description: "A breadcrumb above the title." },
    { id: "with-actions", title: "With actions", description: "Actions at the end of the title line, with one main action." },
    { id: "with-meta", title: "With meta", description: "A status badge, assignees and the last update beside the title." },
    { id: "narrow", title: "Narrow", description: "In a narrow header the actions fold into a \"More actions\" menu; the pinned one stays a button." },
    { id: "with-tabs", title: "With tabs", description: "Tabs right under the header for the page's sections." },
  ],
  accessibility: {
    semantics:
      "The title is a heading, `h1` by default. Actions are buttons; folded ones sit in a `menu` behind a button.",
    labels:
      "Use one `h1` per page, and `as` a lower level for a header inside a section.",
    focus: "Nothing moves focus. The menu returns focus to its button when it closes.",
    limits: [
      "Only `PageHeaderAction`s fold into the menu; other elements in `PageHeaderActions` stay where they are.",
      "The width where the actions fold is fixed at 36rem of the header's width.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "Runs the focused action, or opens the “More actions” menu." },
    { keys: ["↓", "↑"], behaviour: "In the open menu, moves between the folded actions." },
    { keys: ["Escape"], behaviour: "Closes the menu and returns focus to its button." },
  ],
  props: {
    PageHeaderTitle: { as: "The heading element: `h1` (default) to `h6`." },
    PageHeaderAction: {
      variant: "Button's look: `outline` by default, `default` when `pinned`. `destructive` shows red in the menu too.",
      size: "Button's size.",
      disabled: "The action cannot be chosen, as a button or in the menu.",
    },
  },
  theming:
    "The title is `--foreground`, 20 px semibold; the description and meta `--muted-foreground`, 14 px. The actions are the library's Button and DropdownMenu.",
} satisfies ComponentDoc
