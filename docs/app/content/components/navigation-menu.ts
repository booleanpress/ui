import type { ComponentDoc } from "../types.ts"

const AS_CHILD = "Render the child element instead, with this part's behaviour and classes merged onto it."

export default {
  slug: "navigation-menu",
  title: "Navigation menu",
  category: "Menu",
  purpose: "A row of links to a site's or an app's sections, where some open a panel of further links.",
  links: {
    radix: { label: "Radix Navigation Menu", href: "https://www.radix-ui.com/primitives/docs/components/navigation-menu" },
    apg: { label: "APG Disclosure Navigation", href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/" },
    spec: "specs/004_full-suite-components.md#navigation-menu",
  },
  usage: `\`\`\`tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Logs</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/logs/delivery">Delivery log</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Three panels of links and a plain link styled as a trigger." },
    { id: "icons", title: "Icons", description: "Icons in the triggers and links, with each panel under its own trigger." },
    { id: "submenus", title: "Submenus", description: "A second level where each area shows its own links beside it." },
    { id: "mega-menu", title: "Mega menu", description: "A wide panel of grouped links with a highlighted link along the bottom." },
  ],
  accessibility: {
    semantics:
      "A `nav` holding a list; each trigger is a `button` with `aria-expanded`, and the current page's link has `aria-current=\"page\"`. It is a disclosure navigation, not an ARIA menu.",
    labels:
      "Triggers and links are named by their text. Give the menu an `aria-label` when the page has more than one `nav`.",
    focus:
      "Triggers and top-level links are tab stops; Tab from an open trigger moves into its panel.",
    limits: [
      "The triggers carry no chevron, as the visual target; the state is in `aria-expanded`. Add an icon in the trigger if your users need the cue.",
      "Panels open on hover. A panel's links must not be the only way to reach those pages on touch devices: a tap opens the panel, a second tap on a link follows it.",
      "With the shared viewport, every panel opens under the menu's start edge (its right edge in right-to-left pages), not under its trigger; `viewport={false}` puts each panel under its trigger.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the next trigger or link; from an open trigger, into its panel." },
    { keys: ["Enter", "Space"], behaviour: "On a trigger, opens or closes its panel. On a link, follows it." },
    { keys: ["↓"], behaviour: "On an open trigger, moves into its panel." },
    { keys: ["→"], behaviour: "Moves to the next trigger or link in the row (← in right-to-left pages)." },
    { keys: ["←"], behaviour: "Moves to the previous trigger or link in the row (→ in right-to-left pages)." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last trigger or link in the row." },
    { keys: ["Escape"], behaviour: "Closes the open panel and returns focus to its trigger." },
  ],
  props: {
    NavigationMenu: {
      value: "The open panel's value, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The panel open at the start, when it controls itself.",
      onValueChange: "Called with the open item's value, or an empty string when it closes.",
      delayDuration: "Milliseconds the pointer rests on a trigger before its panel opens. 200 by default.",
      skipDelayDuration: "Milliseconds after a panel closes during which another opens at once. 300 by default.",
      viewport: "`true` (default) shows panels in one shared viewport under the menu; `false` under each trigger.",
      orientation: "`horizontal` (default) or `vertical`: which arrow keys move between items.",
      dir: "The reading direction. The provider's `dir` by default.",
    },
    NavigationMenuItem: { value: "The value that names this item, for a controlled menu or a `NavigationMenuSub`." },
    NavigationMenuTrigger: { asChild: AS_CHILD, disabled: "Ignores the pointer and the keyboard." },
    NavigationMenuContent: {
      forceMount: "Keep the panel in the page while closed, for search engines. Hiding it is then yours to do.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
    },
    NavigationMenuLink: {
      asChild: AS_CHILD,
      active: "Marks the link to the current page, with `aria-current=\"page\"`.",
      onSelect: "Called when the link is followed. Call `event.preventDefault()` to keep the panel open.",
    },
    NavigationMenuSub: {
      value: "The shown item's value, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The item shown at the start. One item is always shown, as in tabs.",
      onValueChange: "Called with the value of the item shown.",
      orientation: "`horizontal` (default) or `vertical`: which arrow keys move between its triggers.",
    },
  },
  theming:
    "Triggers have no fill at rest and `--accent` on hover, focus and while open. Panels are `--popover` with a `--border` edge; links use `--accent` when hovered or focused, and their icons `--control-hover`, then `--muted-foreground`.",
} satisfies ComponentDoc
