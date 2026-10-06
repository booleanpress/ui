import type { ComponentDoc } from "../types.ts"

export default {
  slug: "panel",
  title: "Panel",
  category: "Panel",
  purpose: "A bordered box with a header, content and footer, whose content can fold away.",
  links: {
    radix: { label: "Radix Collapsible", href: "https://www.radix-ui.com/primitives/docs/components/collapsible" },
    apg: { label: "APG Disclosure", href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" },
    spec: "specs/004_full-suite-components.md#panel",
  },
  usage: `\`\`\`tsx
<Panel toggleable>
  <PanelHeader>
    <PanelTitle>SMTP connection</PanelTitle>
    <PanelTrigger />
  </PanelHeader>
  <PanelContent>Host smtp.example.com, port 587.</PanelContent>
</Panel>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A title over content that always shows." },
    { id: "toggleable", title: "Toggleable", description: "`toggleable` adds a toggle that folds the content away and back." },
    { id: "controlled", title: "Controlled", description: "`open` and `onOpenChange` let other buttons open and close it." },
    { id: "custom-indicator", title: "Custom indicator", description: "A minus that becomes a plus replaces the chevron." },
    { id: "header-actions", title: "Header actions", description: "An avatar in the title and a menu button before the toggle." },
    { id: "footer", title: "Footer", description: "A footer with buttons that folds away with the content." },
    { id: "disabled", title: "Disabled", description: "A disabled panel cannot be toggled." },
  ],
  accessibility: {
    semantics:
      "The toggle is a `button` with `aria-expanded` that controls the content; closed content is removed from the page.",
    labels:
      "The toggle is named \"Show or hide\" followed by the title. Pass `aria-label` to `PanelTrigger` to name it yourself, and name icon buttons in `PanelActions`.",
    focus:
      "The toggle and the header's buttons are tab stops, then the content's controls.",
    limits: [
      "The title is a `div`: use `asChild` with an `h2` or `h3` where the panel starts a section of the page.",
      "Closed content is removed from the page, so find-in-page and screen readers do not see it, and fields in it lose what was typed. Use `forceMount` on `PanelContent` to keep it in the page, hidden while folded.",
      "The indicator is decoration (`aria-hidden`); the state is in `aria-expanded`.",
    ],
  },
  keyboard: [{ keys: ["Enter", "Space"], behaviour: "On the toggle: shows or hides the content." }],
  props: {
    Panel: {
      toggleable: "Lets a `PanelTrigger` fold the content away. `false` by default.",
      open: "Whether the content shows, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether the content shows at the start, when the panel controls itself. `true` by default.",
      onOpenChange: "Called with the new state when the content is shown or hidden.",
      disabled: "Stops the toggle from working; the content keeps its state.",
    },
    PanelTitle: {
      asChild: "Render the child element instead (an `h2`, an `h3`), with the title's classes merged onto it.",
    },
    PanelTrigger: {
      indicator: "Replaces the chevron. The trigger is the Tailwind group `panel-trigger`, so an icon can follow `data-state`.",
      asChild: "Render the child element instead, with the toggle's behaviour merged onto it.",
    },
    PanelContent: {
      forceMount: "Keeps the content in the page while it is folded, `hidden` once the closing slide ends, so its fields keep their values.",
    },
  },
  theming:
    "The panel is `--card` with a 1px `--border` edge and a 6px radius; the title is 14px semibold. The toggle's icon is `--foreground`, with an `--accent` circle under the pointer; focus is `--ring`.",
} satisfies ComponentDoc
