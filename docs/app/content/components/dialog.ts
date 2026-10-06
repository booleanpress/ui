import type { ComponentDoc } from "../types.ts"

export default {
  slug: "dialog",
  title: "Dialog",
  category: "Overlay",
  purpose: "A window above the page for a focused task, such as editing a record; the page waits until it closes.",
  links: {
    radix: { label: "Radix Dialog", href: "https://www.radix-ui.com/primitives/docs/components/dialog" },
    apg: { label: "APG Dialog (Modal)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" },
    spec: "specs/001_dialog.md",
  },
  usage: `\`\`\`tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Edit mailer</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit mailer</DialogTitle>
      <DialogDescription>Change the name and the sender address.</DialogDescription>
    </DialogHeader>
    <DialogBody>…</DialogBody>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A form in a dialog, with Cancel and Save." },
    { id: "sizes", title: "Sizes", description: "The three widths." },
    { id: "position", title: "Position", description: "`position` places the dialog at the centre or against any edge." },
    { id: "maximizable", title: "Maximisable", description: "`maximizable` adds a button that fills the window with the dialog and restores it." },
    { id: "full-screen", title: "Full screen", description: "`size=\"full\"` opens the dialog filling the whole window." },
    { id: "non-modal", title: "Non-modal", description: "`modal={false}` leaves the page behind usable while the dialog stays open." },
    {
      id: "long-content",
      title: "Inside scroll",
      description: "Tall content scrolls inside the dialog while the title and actions stay visible.",
    },
    { id: "outside-scroll", title: "Outside scroll", description: "`scroll=\"outside\"` lets the whole dialog run past the window and scroll with the page." },
    { id: "responsive", title: "Responsive", description: "`max-w-*` classes with breakpoints make the width change with the window." },
    {
      id: "controlled",
      title: "Opened from code",
      description: "With no trigger, `open` and `onOpenChange` control it, and focus returns to the button that opened it.",
    },
  ],
  accessibility: {
    semantics:
      'A `dialog` named by its title and described by its description; the rest of the page is hidden from assistive technology while it is open.',
    labels:
      "Every dialog needs a `DialogTitle`. If the design has no visible title, keep one for screen readers with `className=\"sr-only\"`.",
    focus:
      "Focus moves into the dialog when it opens, stays inside, and returns to the trigger, or the element that opened it, when it closes.",
    limits: [
      "One dialog at a time. A dialog can open a select or a popover, not a second dialog.",
      "A non-modal dialog trades safety for access: the page is not hidden from screen readers, so someone browsing can leave the dialog without noticing, and a click on the page does not close it. Keep it for panels people consult while they work, give the page a way back to it (its trigger), and keep a decision that must come first in a modal dialog.",
      "A dialog cannot be dragged. Moving it by keyboard needs a focusable handle, arrow-key steps and limits at the window edges, and a modal dialog hides the page anyway; use `position`, or a non-modal dialog, to keep part of the page in view.",
      "With `scroll=\"outside\"`, dragging the mask's own scrollbar does not close the dialog, but on systems whose scrollbars float over the content (macOS by default) a press on that strip counts as a press on the mask and closes it.",
    ],
  },
  keyboard: [
    { keys: ["Escape"], behaviour: "Closes the dialog." },
    { keys: ["Tab"], behaviour: "Moves to the next focusable element inside the dialog, wrapping from the last to the first. In a non-modal dialog, from the last it moves on to the page after the element that opened it." },
    { keys: ["Shift", "Tab"], behaviour: "Moves to the previous focusable element inside the dialog, wrapping from the first to the last. In a non-modal dialog, from the first it goes back to the element that opened it." },
    { keys: ["Enter", "Space"], behaviour: "On the maximise button, fills the window with the dialog, or restores it." },
  ],
  props: {
    Dialog: {
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
      modal: "`true` (the default): the rest of the page cannot be reached while it is open. `false`: no mask, the page stays usable, and Tab can leave the dialog; read the limits above first.",
    },
    DialogTrigger: { asChild: "Render the child element instead, with this part's behaviour and classes merged onto it." },
    DialogClose: { asChild: "Render the child element instead, with this part's behaviour and classes merged onto it." },
    DialogPortal: {
      container: "Where the dialog is rendered. By default, at the end of `<body>`.",
      forceMount: "Keep it in the DOM while closed, for an animation library to control.",
    },
    DialogOverlay: {
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
      forceMount: "Keep it in the DOM while closed, for an animation library to control.",
    },
    DialogContent: {
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
      forceMount: "Keep it in the DOM while closed, for an animation library to control.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
      onPointerDownOutside: "Called when the pointer goes down outside it. Call `event.preventDefault()` to keep it open.",
      onInteractOutside: "Called on any pointer down or focus outside it. Call `event.preventDefault()` to keep it open.",
      onOpenAutoFocus: "Called when focus moves in as it opens. Call `event.preventDefault()` to choose the element yourself.",
      onCloseAutoFocus: "Called when focus leaves as it closes. Call `event.preventDefault()` to choose where focus goes.",
    },
    DialogTitle: { asChild: "Render the child element instead, with this part's behaviour and classes merged onto it." },
    DialogDescription: { asChild: "Render the child element instead, with this part's behaviour and classes merged onto it." },
  },
  theming:
    "The panel is a floating surface, like menus and popovers: `--popover` and `--popover-foreground`. Its height stops below the WordPress admin bar (`--wp-admin--admin-bar--height`).",
} satisfies ComponentDoc
