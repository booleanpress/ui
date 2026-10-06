import type { ComponentDoc } from "../types.ts"

const AS_CHILD = "Render the child element instead, with this part's behaviour and classes merged onto it."
const FORCE_MOUNT = "Keep it in the DOM while closed, for an animation library to control."

export default {
  slug: "alert-dialog",
  title: "Alert dialog",
  category: "Overlay",
  purpose: "A modal question that needs an answer before the page continues, such as confirming a deletion.",
  links: {
    radix: { label: "Radix Alert Dialog", href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog" },
    apg: { label: "APG Alert and Message Dialogs", href: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/" },
    spec: "specs/002_pilot-mini-specs.md#alertdialog-sheet",
  },
  usage: `\`\`\`tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Delete mailer</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete the Primary mailer?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete mailer</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
\`\`\`

If the action removes the row that held the trigger, pass \`returnFocusTo\` to \`AlertDialogContent\` so focus has somewhere to go.`,
  examples: [
    { id: "basic", title: "Basic", description: "A deletion confirmation with Cancel and a destructive action." },
    { id: "small", title: "Small", description: "A narrow dialog with the two buttons side by side." },
    { id: "with-icon", title: "With an icon", description: "An icon beside the title." },
    {
      id: "return-focus",
      title: "Return focus",
      description: "Deleting a row removes its trigger, so focus goes to the list heading instead.",
    },
  ],
  accessibility: {
    semantics:
      'A `role="alertdialog"`, named by its title and described by its description; the rest of the page is hidden while it is open.',
    labels:
      "Give every alert dialog a title and a description of what will happen. Name the buttons by what they do, not \"OK\".",
    focus:
      "Focus moves to Cancel when it opens and stays inside; it returns to the trigger when it closes.",
    limits: [
      "It has no × button and ignores clicks on the backdrop, on purpose. Always provide Cancel.",
      "One dialog at a time: an alert dialog does not open a second dialog.",
    ],
  },
  keyboard: [
    { keys: ["Escape"], behaviour: "Closes it without running the action." },
    { keys: ["Tab"], behaviour: "Moves to the next button inside the dialog, wrapping from the last to the first." },
    { keys: ["Shift", "Tab"], behaviour: "Moves to the previous button, wrapping from the first to the last." },
    { keys: ["Enter", "Space"], behaviour: "Presses the focused button." },
  ],
  props: {
    AlertDialog: {
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
    },
    AlertDialogTrigger: { asChild: AS_CHILD },
    AlertDialogPortal: {
      container: "Where the dialog is rendered. By default, at the end of `<body>`.",
      forceMount: FORCE_MOUNT,
    },
    AlertDialogOverlay: { asChild: AS_CHILD, forceMount: FORCE_MOUNT },
    AlertDialogContent: {
      asChild: AS_CHILD,
      forceMount: FORCE_MOUNT,
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
      onOpenAutoFocus: "Called when focus moves in as it opens. Call `event.preventDefault()` to choose the element yourself.",
      onCloseAutoFocus: "Called when focus leaves as it closes. Call `event.preventDefault()` to choose where focus goes.",
    },
    AlertDialogTitle: { asChild: AS_CHILD },
    AlertDialogDescription: { asChild: AS_CHILD },
    AlertDialogAction: {
      asChild: AS_CHILD,
      variant: "The button's emphasis: `default`, `destructive`, `outline`, `secondary`, `ghost` or `link`.",
      size: "The button's density: `default`, `sm`, `xs`, `lg` or an icon size.",
    },
    AlertDialogCancel: {
      asChild: AS_CHILD,
      variant: "The button's emphasis. `outline` by default.",
      size: "The button's density.",
    },
  },
  theming:
    "The panel is a floating surface, like menus and popovers: `--popover` and `--popover-foreground`. Its height stops below the WordPress admin bar (`--wp-admin--admin-bar--height`).",
} satisfies ComponentDoc
