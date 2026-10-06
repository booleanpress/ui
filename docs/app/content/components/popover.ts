import type { ComponentDoc } from "../types.ts"

const AS_CHILD = "Render the child element instead, with this part's behaviour and classes merged onto it."

export default {
  slug: "popover",
  title: "Popover",
  category: "Overlay",
  purpose: "A small panel of extra content or controls next to the element that opened it. The page stays usable.",
  links: {
    radix: { label: "Radix Popover", href: "https://www.radix-ui.com/primitives/docs/components/popover" },
    apg: { label: "APG Dialog (Non-Modal)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" },
    spec: "specs/002_pilot-mini-specs.md#popover",
  },
  usage: `\`\`\`tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Delivery status</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Delivered</PopoverTitle>
      <PopoverDescription>The mail server accepted this email.</PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A heading and a sentence of explanation." },
    { id: "placement", title: "Placement", description: "`side` places it on each of the four sides, and it flips when there is no room." },
    { id: "form", title: "With a form", description: "A short form inside; focus moves to the first field when it opens." },
    { id: "controlled", title: "Controlled", description: "`open` and `onOpenChange` let the content close it." },
  ],
  accessibility: {
    semantics:
      'The trigger is a `button` with `aria-haspopup="dialog"`, and the content is a non-modal `dialog`; a click outside closes it.',
    labels:
      "The trigger's text names the content. For a form or group of controls, add `aria-label` or `aria-labelledby` to `PopoverContent`.",
    focus:
      "Focus moves into the content when it opens and returns to the trigger when it closes.",
    limits: ["`PopoverTitle` renders a `div`, not a heading, and does not name the dialog by itself."],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "On the trigger, opens or closes the popover." },
    { keys: ["Escape"], behaviour: "Closes it and returns focus to the trigger." },
    { keys: ["Tab"], behaviour: "Moves through the content, wrapping from the last element to the first; Shift+Tab goes the other way. Escape or a click outside closes it." },
  ],
  props: {
    Popover: {
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
      modal: "When `true`, the rest of the page cannot be reached while it is open. `false` by default.",
    },
    PopoverTrigger: { asChild: AS_CHILD },
    PopoverAnchor: { asChild: AS_CHILD },
    PopoverContent: {
      asChild: AS_CHILD,
      side: "The preferred side: `top`, `right`, `bottom` or `left`. `bottom` by default; it flips when there is no room.",
      align: "Alignment along that side: `start`, `center` or `end`. `center` by default.",
      sideOffset: "Distance in pixels from the trigger. 4 by default.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
      onInteractOutside: "Called on any pointer down or focus outside it. Call `event.preventDefault()` to keep it open.",
      onOpenAutoFocus: "Called when focus moves in as it opens. Call `event.preventDefault()` to choose the element yourself.",
      onCloseAutoFocus: "Called when focus leaves as it closes. Call `event.preventDefault()` to choose where focus goes.",
    },
  },
  theming: "The panel is a floating surface: `--popover` and `--popover-foreground`, with the border token and a medium shadow.",
} satisfies ComponentDoc
