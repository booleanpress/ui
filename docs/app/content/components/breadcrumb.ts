import type { ComponentDoc } from "../types.ts"

export default {
  slug: "breadcrumb",
  title: "Breadcrumb",
  category: "Menu",
  purpose: "Shows where the current page sits in the hierarchy and links back up it.",
  links: {
    apg: { label: "APG Breadcrumb", href: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/" },
    spec: "specs/003_moved-components.md#breadcrumb",
  },
  usage: `\`\`\`tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/mailers">Mailers</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Primary mailer</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Two links and the current page." },
    { id: "ellipsis", title: "Collapsed levels", description: "`BreadcrumbEllipsis` stands for levels that are left out." },
    { id: "dropdown", title: "With a menu", description: "An item opens a dropdown menu to switch to a sibling." },
    { id: "custom-separator", title: "Custom separator", description: "Children of `BreadcrumbSeparator` replace the chevron." },
  ],
  accessibility: {
    semantics:
      'A `nav` landmark holding an ordered list. The current page has `aria-current="page"`; separators are hidden.',
    labels:
      "The landmark's name comes from the provider's `breadcrumb` string; translate it there.",
    focus:
      "Each link is in the tab order. Wrap the ellipsis in a link or a menu trigger so collapsed levels can be reached.",
    limits: [
      "`BreadcrumbPage` has `role=\"link\"` with `aria-disabled=\"true\"`, as in shadcn/ui, so a screen reader announces a disabled link.",
      "`BreadcrumbEllipsis` is hidden from assistive technology (`aria-hidden`), so its visually hidden label is never read; name the control that wraps it.",
    ],
  },
  keyboard: [{ keys: ["Tab"], behaviour: "Moves between the links. The current page is skipped." }],
  props: {
    BreadcrumbLink: { asChild: "Render the child element instead, such as a router link, with this part's classes merged onto it." },
  },
  theming: "Links are `--muted-foreground` and turn `--foreground` on hover; the current page is `--foreground`. Separators, the ellipsis and icons inside links are the lighter `--control-hover`.",
} satisfies ComponentDoc
