import type { ComponentDoc } from "../types.ts"

export default {
  slug: "sidebar",
  title: "Sidebar",
  category: "Menu",
  purpose: "The navigation column of an admin screen: groups of links that collapse to icons or hide entirely.",
  links: {
    spec: "specs/003_moved-components.md#sidebar",
  },
  usage: `\`\`\`tsx
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Delivery</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive tooltip="Email log">
              <a href="/logs">Email log</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <header>
      <SidebarTrigger />
    </header>
    {children}
  </SidebarInset>
</SidebarProvider>
\`\`\`

It positions itself against the window, so place it once in the app's outer layout.`,
  examples: [
    {
      id: "admin-layout",
      title: "Admin layout",
      description: "A sidebar that collapses to icons, with groups, a badge and a submenu.",
      frameHeight: 460,
    },
    {
      id: "default-closed",
      title: "Starting collapsed",
      description: "`defaultOpen={false}` starts it collapsed until someone opens it.",
      frameHeight: 420,
    },
    {
      id: "right-side",
      title: "On the right",
      description: "`side=\"right\"` makes a panel that slides out of view.",
      frameHeight: 420,
    },
    {
      id: "floating",
      title: "Floating",
      description: "`variant=\"floating\"` draws the sidebar as a card with a margin round it.",
      frameHeight: 420,
    },
    {
      id: "inset",
      title: "Inset",
      description: "`variant=\"inset\"` puts the page in a card beside the sidebar.",
      frameHeight: 420,
    },
    {
      id: "dual",
      title: "Dual sidebar",
      description: "A collapsible sidebar on the left and a fixed panel on the right.",
      frameHeight: 420,
    },
    {
      id: "nested-menu",
      title: "Nested menu",
      description: "Sub-menus inside sub-menus, each opened with `Collapsible`.",
      frameHeight: 420,
    },
  ],
  accessibility: {
    semantics:
      "A plain container with menus as lists. Wrap the links in a named `nav`. On narrow windows the sidebar becomes a modal `dialog`.",
    labels:
      "The trigger is named for you. In the collapsed rail, each button keeps its text for screen readers. Set `aria-current=\"page\"` on the current link.",
    focus:
      "The trigger and every menu button are tab stops. On narrow windows the dialog moves focus in and returns it to the trigger.",
    limits: [
      "`isActive` only styles the item; it does not set `aria-current`. Set it on the link yourself.",
      "It positions itself against the window, so it cannot sit inside a smaller panel. The examples render each in its own frame.",
      "A tooltip shows only in the collapsed rail, never when the sidebar is open or on narrow windows.",
      "Only one sidebar per provider collapses: the provider holds one open state, and Ctrl+B toggles it. Two providers would both answer Ctrl+B and share the saved state, so a second sidebar stays fixed (`collapsible=\"none\"`) and is hidden below 768 px.",
    ],
  },
  keyboard: [
    { keys: ["Ctrl", "B"], behaviour: "Toggles the sidebar from anywhere on the page. ⌘B on macOS." },
    { keys: ["Enter", "Space"], behaviour: "On the trigger or a menu button, presses it. On a menu button that opens a sub-menu, opens or closes it." },
    { keys: ["Tab"], behaviour: "Moves through the trigger and the menu buttons in order." },
    { keys: ["Escape"], behaviour: "On narrow windows, closes the sheet and returns focus to the trigger." },
  ],
  props: {
    SidebarProvider: {
      defaultOpen: "Whether it starts open. `true` by default; a choice saved in local storage wins.",
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      onOpenChange: "Called with `true` or `false` when it opens or collapses.",
    },
    Sidebar: {
      side: "`left` or `right`. `left` by default.",
      variant: "`sidebar` (full height, a border), `floating` (a card with a margin) or `inset` (the page sits in a card beside it).",
      collapsible: "What the toggle does: `offcanvas` slides it out of view, `icon` leaves a rail of icons, `none` keeps it fixed.",
    },
    SidebarMenuButton: {
      asChild: "Render the child element instead, such as a link, with this part's classes merged onto it.",
      isActive: "Marks the current page (`data-active`) and highlights it.",
      variant: "`default`, or `outline` for a bordered button.",
      size: "`default` (32 px), `sm` (28 px) or `lg` (48 px).",
      tooltip: "Text, or `TooltipContent` props, shown beside the button while the sidebar is collapsed to icons.",
    },
    SidebarMenuAction: {
      asChild: "Render the child element instead, with this part's classes merged onto it.",
      showOnHover: "Show it only while the row is hovered or has focus.",
    },
    SidebarMenuSubButton: {
      asChild: "Render the child element instead, such as a router link.",
      isActive: "Marks the current page and highlights it.",
      size: "`sm` or `md`. `md` by default.",
    },
    SidebarGroupLabel: { asChild: "Render the child element instead, with this part's classes merged onto it." },
    SidebarGroupAction: { asChild: "Render the child element instead, with this part's classes merged onto it." },
    SidebarMenuSkeleton: { showIcon: "Draw a square where the icon goes." },
  },
  theming:
    "The sidebar has its own tokens: `--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border` and `--sidebar-ring`. Group labels and counts are `--muted-foreground`, and icons in menu buttons the lighter `--control-hover`, turning `--muted-foreground` on hover. Width is `--sidebar-width` (16rem) and `--sidebar-width-icon` (3rem) on the provider; override them with `style`. On narrow windows the sheet is 18rem wide.",
} satisfies ComponentDoc
