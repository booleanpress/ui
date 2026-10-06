import type { ComponentDoc } from "../types.ts"

const AS_CHILD = "Render the child element instead, with this part's behaviour and classes merged onto it."
const FORCE_MOUNT = "Keep it in the DOM while closed, for an animation library to control."

export default {
  slug: "sheet",
  title: "Sheet",
  category: "Overlay",
  purpose: "A panel that slides in from an edge of the window for a task or detail that belongs beside the page.",
  links: {
    radix: { label: "Radix Dialog", href: "https://www.radix-ui.com/primitives/docs/components/dialog" },
    apg: { label: "APG Dialog (Modal)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" },
    spec: "specs/002_pilot-mini-specs.md#alertdialog-sheet",
  },
  usage: `\`\`\`tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Edit connection</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit connection</SheetTitle>
      <SheetDescription>Change how this mailer signs in.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <SheetClose asChild>
        <Button>Save</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A form in a right-hand sheet, with Save and Cancel in the footer." },
    { id: "sides", title: "Sides", description: "`side` opens the sheet from any of the four edges." },
    { id: "full-screen", title: "Full screen", description: "`size=\"full\"` covers the whole window." },
    { id: "long-content", title: "Long content", description: "Long content scrolls while the header and footer stay in place." },
    { id: "no-close-button", title: "Without the ×", description: "`showCloseButton={false}` removes the × when the footer offers the ways out." },
  ],
  accessibility: {
    semantics:
      'A modal `dialog`, named by `SheetTitle` and described by `SheetDescription`. The rest of the page is hidden from assistive technology while it is open.',
    labels:
      "Every sheet needs a `SheetTitle`; add `className=\"sr-only\"` if the design shows none.",
    focus:
      "Focus moves into the sheet when it opens and stays inside. When it closes, focus returns to the trigger.",
    limits: ["One modal at a time: a sheet can open a select or a popover, not a second sheet or dialog."],
  },
  keyboard: [
    { keys: ["Escape"], behaviour: "Closes the sheet." },
    { keys: ["Tab"], behaviour: "Moves to the next focusable element inside the sheet, wrapping from the last to the first." },
    { keys: ["Shift", "Tab"], behaviour: "Moves to the previous focusable element, wrapping from the first to the last." },
  ],
  props: {
    Sheet: {
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
      modal: "Keep it modal: the rest of the page cannot be reached while it is open. Leave it on.",
    },
    SheetTrigger: { asChild: AS_CHILD },
    SheetClose: { asChild: AS_CHILD },
    SheetPortal: {
      container: "Where the sheet is rendered. By default, at the end of `<body>`.",
      forceMount: FORCE_MOUNT,
    },
    SheetOverlay: { asChild: AS_CHILD, forceMount: FORCE_MOUNT },
    SheetContent: {
      asChild: AS_CHILD,
      forceMount: FORCE_MOUNT,
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
      onPointerDownOutside: "Called when the pointer goes down outside it. Call `event.preventDefault()` to keep it open.",
      onInteractOutside: "Called on any pointer down or focus outside it. Call `event.preventDefault()` to keep it open.",
      onOpenAutoFocus: "Called when focus moves in as it opens. Call `event.preventDefault()` to choose the element yourself.",
      onCloseAutoFocus: "Called when focus leaves as it closes. Call `event.preventDefault()` to choose where focus goes.",
    },
    SheetTitle: { asChild: AS_CHILD },
    SheetDescription: { asChild: AS_CHILD },
  },
  theming:
    "The panel is a floating surface, like menus and popovers: `--popover` and `--popover-foreground`. The left and right sheets are placed with logical edges (`start`, `end`), so in a right-to-left page `side=\"right\"` sits at the left edge and slides in from it. Every sheet but a bottom one starts below the WordPress admin bar (`--wp-admin--admin-bar--height`).",
} satisfies ComponentDoc
