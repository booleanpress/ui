import type { ComponentDoc } from "../types.ts"

export default {
  slug: "drawer",
  title: "Drawer",
  category: "Overlay",
  purpose: "A panel that slides in from an edge, usually the bottom, and closes when dragged back.",
  links: {
    apg: { label: "APG Dialog (Modal)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" },
    spec: "specs/004_full-suite-components.md#drawer",
  },
  peers: ["@base-ui/react"],
  usage: `\`\`\`tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">View today’s deliveries</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Today’s deliveries</DrawerTitle>
      <DrawerDescription>Primary mailer.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="outline">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
\`\`\``,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description: "Opens from the bottom; drag it down, press Escape, click outside or press Close.",
    },
    {
      id: "sides",
      title: "Sides",
      description: "`direction` opens it from the top, start or end edge instead.",
    },
    {
      id: "responsive",
      title: "Responsive",
      description: "A Dialog on wide screens and a Drawer on narrow ones, with the same content.",
    },
    {
      id: "scrollable",
      title: "Scrollable content",
      description: "A long list scrolls inside the drawer while the header and footer stay.",
    },
  ],
  accessibility: {
    semantics:
      "The panel has `role=\"dialog\"`, named by `DrawerTitle` and described by `DrawerDescription`; the page behind it is inert while it is open.",
    labels:
      "Every drawer needs a `DrawerTitle`, hidden with `sr-only` if the design has none. Always include a close button, as dragging is not the only way out.",
    focus:
      "Opening moves focus into the drawer and Tab stays inside it. Closing returns focus to the trigger.",
    limits: [
      "One modal at a time: do not open a drawer from inside a Dialog or a Sheet.",
      "The drag gesture is a pointer feature; keyboard and screen-reader users close with Escape or the close button.",
      "Snap points, nested drawers and the indent effect of Base UI's Drawer are not part of this API yet; Base UI's own parts can be used for them.",
    ],
  },
  keyboard: [
    { keys: ["Escape"], behaviour: "Closes the drawer and returns focus to the trigger. With a select, menu or popover open inside it, closes that first." },
    { keys: ["Tab"], behaviour: "Moves to the next focusable element inside the drawer, wrapping from the last to the first." },
    { keys: ["Shift", "Tab"], behaviour: "Moves to the previous focusable element inside the drawer, wrapping from the first to the last." },
  ],
  theming:
    "The panel is `--card` and `--card-foreground` with the `--border` edge on its open side, a 12 px radius on the corners away from its edge, and the modal shadow. The backdrop is `--mask`, and it fades as the drawer is dragged away. The handle bar is `--muted`. Enter and exit motion is the modal motion, set once in `theme.css`.",
  props: {
    Drawer: {
      direction: "The edge it opens from: `bottom` (the default), `top`, `left` or `right`. `left` and `right` follow the reading direction.",
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with `true` or `false`, and the event's details, when it opens or closes.",
      onOpenChangeComplete: "Called once the open or close animation has finished.",
      modal: "`true` (the default) makes the rest of the page inert; `\"trap-focus\"` only keeps focus inside; `false` leaves the page usable.",
      swipeDirection: "The drag direction that closes it. It follows `direction`; set it only to override that.",
      disablePointerDismissal: "Keeps it open when people click outside it.",
    },
    DrawerTrigger: {
      asChild: "Render the child element instead, with this part's behaviour merged onto it.",
    },
    DrawerClose: {
      asChild: "Render the child element instead, with this part's behaviour merged onto it.",
    },
    DrawerPortal: {
      container: "Where the drawer is rendered. By default, at the end of `<body>`.",
      keepMounted: "Keep it in the DOM while closed.",
    },
    DrawerContent: {
      initialFocus: "The element that takes focus on open, or `false` to leave focus where it is.",
      finalFocus: "The element that takes focus on close, or `false` to leave focus where it is.",
    },
  },
} satisfies ComponentDoc
